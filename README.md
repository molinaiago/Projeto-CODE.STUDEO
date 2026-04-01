# CODE.STUDEO 🚀

> Plataforma Interativa para o Ensino de Lógica de Programação e Algoritmos.

https://code-studeo-tcc.pages.dev/

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

## 📖 Sobre o Projeto

**CODE.STUDEO** é uma plataforma web desenvolvida como Trabalho de Conclusão de Curso (TCC) em Ciência da Computação na URI Câmpus Santiago. 

O objetivo do projeto é apoiar o ensino de **Pensamento Computacional** nos anos finais do Ensino Fundamental e no Ensino Médio, alinhado às diretrizes da **BNCC**. Diferente de outras soluções que focam apenas no aluno (com blocos ou jogos), o CODE.STUDEO foi desenhado para empoderar também o **professor**, oferecendo ferramentas de diagnóstico pedagógico para identificar dificuldades coletivas da turma.

### 🎯 Diferenciais
* **Foco no Professor:** Painel de diagnóstico que identifica "Pontos de Atenção" na turma.
* **Abordagem Textual:** Transição suave da lógica visual para a programação textual/sequencial.
* **Design IDE-Like:** Interface em *dark mode* para ambientar o aluno à realidade profissional.

---

## ✨ Funcionalidades

A plataforma divide-se em duas jornadas distintas:

### 👨‍🎓 Para o Aluno
* **Trilhas de Aprendizagem:**
    * *Básica:* Ideias de algoritmo, sequenciamento e lógica booleana.
    * *Intermediária:* Estruturas de controle (Laços e Condicionais) e Vetores.
    * *Avançada:* Complexidade de algoritmos (Big O), Busca e Ordenação.
* **Exercícios Interativos:** Atividades de ordenação lógica, múltipla escolha e quizzes conceituais.
* **Gamificação:** Feedback imediato e acompanhamento de progresso visual.
* **Turmas Virtuais:** Entrada em turmas gerenciadas por professores via código de convite.

### 👨‍🏫 Para o Professor
* **Gestão de Turmas:** Criação e gerenciamento de salas de aula virtuais.
* **Diagnóstico Pedagógico:** Visualização de desempenho coletivo.
* **Pontos de Atenção:** O sistema destaca automaticamente quais tópicos (ex: "Laços de Repetição") a turma está errando mais, permitindo intervenções precisas.

---

## 🛠 Tecnologias Utilizadas

O projeto utiliza uma arquitetura moderna e escalável:

* **Frontend:** React (Vite) + TypeScript (opcional, se usou).
* **Estilização:** Tailwind CSS (Utility-first para design responsivo e ágil).
* **Roteamento:** React Router DOM (SPA - Single Page Application).
* **Backend & Auth:** Firebase Authentication (Login/Cadastro e gestão de perfis).
* **Banco de Dados:** Cloud Firestore (NoSQL para persistência de progresso e turmas).
* **Deploy:** Cloudflare Pages (CI/CD automático).

---

## 🚀 Como Rodar o Projeto

Pré-requisitos: Node.js instalado.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/molinaiago/Projeto-CODE.STUDEO.git](https://github.com/molinaiago/Projeto-CODE.STUDEO.git)
    cd Projeto-CODE.STUDEO
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configuração do Firebase:**
    * Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
    * Habilite o **Authentication** e o **Firestore**.
    * Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais:
    ```env
    VITE_API_KEY=sua_api_key
    VITE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
    VITE_PROJECT_ID=seu_project_id
    ...
    ```

4.  **Execute o projeto:**
    ```bash
    npm run dev
    ```

---

## 📚 Contexto Acadêmico

Este projeto foi desenvolvido como requisito para obtenção do grau de Bacharel em Ciência da Computação.

* **Autor:** Iago Molina Camargo
* **Orientadora:** Profa. Me. Carla Lisiane de Oliveira Castanho
* **Instituição:** URI - Universidade Regional Integrada do Alto Uruguai e das Missões (Câmpus Santiago)
* **Ano:** 2025

> "A verdadeira inteligência de uma cidade não reside em seus sensores, mas na qualificação e capacidade de aprendizagem contínua dos cidadãos."

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com 💜 por [Iago Molina](https://github.com/molinaiago)
