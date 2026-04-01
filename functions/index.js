const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

exports.entrarNaTurma = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).send({ error: { message: "Não autorizado: Token não fornecido." } });
    }
    const idToken = authorizationHeader.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;
      const { codigoDaTurma } = req.body.data;

      const turmasRef = db.collection("turmas");
      const snapshot = await turmasRef.where("codigoDaTurma", "==", codigoDaTurma.toUpperCase()).limit(1).get();

      if (snapshot.empty) {
        return res.status(200).send({ data: { success: false, message: "Nenhuma turma encontrada com este código." } });
      }

      const turmaDoc = snapshot.docs[0];
      const turmaData = turmaDoc.data();

      if (turmaData.alunosUids && turmaData.alunosUids.includes(userId)) {
        return res.status(200).send({ data: { success: false, message: "Você já está matriculado nesta turma." } });
      }

      const userDoc = await db.collection("users").doc(userId).get();
      if (!userDoc.exists) {
        return res.status(404).send({ error: { message: "Perfil de usuário não encontrado." } });
      }

      const userData = userDoc.data();
      await turmaDoc.ref.update({
        alunos: admin.firestore.FieldValue.arrayUnion({
          uid: userId,
          nome: userData.nome,
          email: userData.email,
        }),
        alunosUids: admin.firestore.FieldValue.arrayUnion(userId),
      });

      return res.status(200).send({ data: { success: true, message: `Você foi adicionado à turma "${turmaData.nomeDaTurma}"!` } });
    } catch (error) {
      console.error("Erro na função entrarNaTurma:", error);
      return res.status(401).send({ error: { message: "Não autorizado: Token inválido ou expirado." } });
    }
  });
});

exports.removerAluno = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).send({ error: { message: "Não autorizado." } });
    }
    const idToken = authorizationHeader.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const professorUid = decodedToken.uid;
      const { turmaId, alunoUid, alunoEmail, alunoNome } = req.body.data;

      const turmaRef = db.collection("turmas").doc(turmaId);
      const turmaDoc = await turmaRef.get();
      const turmaData = turmaDoc.data();

      if (!turmaDoc.exists || turmaData.professorId !== professorUid) {
        return res.status(403).send({ error: { message: "Permissão negada." } });
      }

      await turmaRef.update({
        alunos: admin.firestore.FieldValue.arrayRemove({ uid: alunoUid, email: alunoEmail, nome: alunoNome }),
        alunosUids: admin.firestore.FieldValue.arrayRemove(alunoUid),
      });

      return res.status(200).send({ data: { success: true, message: "Aluno removido com sucesso." } });
    } catch (error) {
      console.error("Erro na função removerAluno:", error);
      return res.status(500).send({ error: { message: "Erro interno do servidor ao remover aluno." } });
    }
  });
});

exports.editarNomeTurma = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).send({ error: { message: "Não autorizado." } });
    }
    const idToken = authorizationHeader.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const professorUid = decodedToken.uid;
      const { turmaId, novoNome } = req.body.data;

      if (!novoNome || novoNome.trim().length < 3) {
        return res.status(400).send({ error: { message: "O nome da turma deve ter pelo menos 3 caracteres." } });
      }

      const turmaRef = db.collection("turmas").doc(turmaId);
      const turmaDoc = await turmaRef.get();

      if (!turmaDoc.exists || turmaDoc.data().professorId !== professorUid) {
        return res.status(403).send({ error: { message: "Permissão negada." } });
      }

      await turmaRef.update({ nomeDaTurma: novoNome.trim() });

      return res.status(200).send({ data: { success: true, message: "Nome da turma atualizado." } });
    } catch (error) {
      console.error("Erro na função editarNomeTurma:", error);
      return res.status(500).send({ error: { message: "Erro interno do servidor." } });
    }
  });
});

exports.deletarTurma = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).send({ error: { message: "Não autorizado." } });
    }
    const idToken = authorizationHeader.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const professorUid = decodedToken.uid;
      const { turmaId } = req.body.data;

      const turmaRef = db.collection("turmas").doc(turmaId);
      const turmaDoc = await turmaRef.get();

      if (!turmaDoc.exists || turmaDoc.data().professorId !== professorUid) {
        return res.status(403).send({ error: { message: "Permissão negada." } });
      }

      await turmaRef.delete();

      return res.status(200).send({ data: { success: true, message: "Turma deletada com sucesso." } });
    } catch (error) {
      console.error("Erro na função deletarTurma:", error);
      return res.status(500).send({ error: { message: "Erro interno do servidor ao deletar turma." } });
    }
  });
});

exports.sairDaTurma = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).send({ error: { message: "Não autorizado." } });
    }
    const idToken = authorizationHeader.split("Bearer ")[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const alunoUid = decodedToken.uid;
      const { turmaId } = req.body.data;

      const turmaRef = db.collection("turmas").doc(turmaId);
      const turmaDoc = await turmaRef.get();
      
      if (!turmaDoc.exists) {
        return res.status(404).send({ error: { message: "Turma não encontrada." } });
      }
      
      const turmaData = turmaDoc.data();
      
      if (!turmaData.alunosUids || !turmaData.alunosUids.includes(alunoUid)) {
        return res.status(403).send({ error: { message: "Você não está matriculado nesta turma." } });
      }
      
      const userDoc = await db.collection("users").doc(alunoUid).get();
      if (!userDoc.exists) {
        return res.status(404).send({ error: { message: "Perfil de usuário não encontrado." } });
      }
      
      const userData = userDoc.data();

      await turmaRef.update({
        alunos: admin.firestore.FieldValue.arrayRemove({ 
          uid: alunoUid, 
          nome: userData.nome, 
          email: userData.email 
        }),
        alunosUids: admin.firestore.FieldValue.arrayRemove(alunoUid),
      });

      return res.status(200).send({ data: { success: true, message: "Você saiu da turma com sucesso." } });
    } catch (error) {
      console.error("Erro na função sairDaTurma:", error);
      return res.status(500).send({ error: { message: "Erro interno do servidor ao sair da turma." } });
    }
  });
});