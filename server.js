import express, { query } from 'express'
import { db } from './db.js'

const server = express()
const port = 3008

server.use(express.static('public'));
server.set('view engine', 'ejs');
server.use(express.urlencoded({ extended: true })); 

//Testar conecxao
db.connect((erro) => {
  if(erro) console.log('erro ao conectar')

  return console.log('conexão estabelecida')
})

// Função para formatar a data
function formatarData(data) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(data).toLocaleDateString('pt-BR', options);
  }

//Exibir lista de alunos
server.get('/', (req, res) => {
  const q = 'SELECT * FROM alunos';

  db.query(q, (error, results) => {
    if (error) return res.json(error);

    res.locals.formatarData = formatarData;

    res.render('index', {alunos:results});
  })
})

//Adicionar um novo aluno
server.post('/adicionar', (req, res) => {
    const{nome, sobrenome, email, data_nascimento} = req.body;

    if(!nome || !sobrenome || ! email || !data_nascimento){
        return res.status(400).json({error: 'Todos os campos sao obrigatorios'});
    }

    const insertQuery = 'INSERT INTO alunos (nome, sobrenome, email, data_nascimento) VALUES (?, ?, ?, ?)';
    db.query(insertQuery,[nome,sobrenome,email,data_nascimento], (error, results) => {
        if(error) return res.json(error);
        res.redirect('/');
    });
});

//Retorno messagem do servidor
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}🚀`)
})