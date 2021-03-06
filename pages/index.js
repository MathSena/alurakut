import React from 'react';
import nookies from 'nookies';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import jwt from 'jsonwebtoken';
import {AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault} from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';


function ProfileSideBar(propriedades){
  return(
  <Box as="aside">
    <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius:'8px;'}}></img>
    <hr />

    <p>
      <a className ="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
        @{propriedades.githubUser}
      </a>
      </p>
      <hr />
    <AlurakutProfileSidebarMenuDefault />
  </Box>
  )
}

function ProfileRelationsBox(propriedades){
  return(
    <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          {propriedades.title} ({propriedades.items.length})
          </h2>
          <ul>
          {/* seguidores.map((itemAtual) =>{
            return(
              <li key = {itemAtual}>
              <a href={`https://github.com/${itemAtual}.png`}>
                <img src={itemAtual.image} />       
              <span>{itemAtual.title}</span>          
              </a>
              </li>
            )
          }) */}
          </ul>
        </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const usuarioAleatorio = props.githubUser;
  const [comunidades, setComunidades] = React.useState([]);
  // const comunidades =['Alurakut'];
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]
  
  const [seguidores, setSeguidores] = React.useState([]);
  // 0 - Pegar o array de dados do github 
  React.useEffect(function() {
    // GET
    fetch('https://api.github.com/users/mathsena/followers')
    .then(function (respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta) {
      setSeguidores(respostaCompleta);
    })

    //API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers:{
        'Authorization': 'cf9c2195427823e7c9d2bed8a0533d',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({"query": `query {
        allCommunities {
          title
          id
          imageUrl
          creatorSlug
        }
      }`})
    })
    .then((response)=> response.json())
    .then((respostaCompleta)=> {
      const comunidadesDato = respostaCompleta.data.allCommunities;
      console.log(comunidadesDato)
      setComunidades(comunidadesDato) 
    })
}, [])

// 1 - Criar um box que ter?? um map, baseado nos items da array que pegamos na API do github

  return (
    <>
    <AlurakutMenu />
    <MainGrid>
      {/* <Box style="grid-area: profileArea;" >*/}
      <div className="profileArea" style={{ gridArea: 'profileArea' }}>
       <ProfileSideBar githubUser={usuarioAleatorio} />
      </div>
      <div className="welcomeArea"  style={{ gridArea: 'welcomeArea' }}>
        <Box>
          <h1 className="title">Bem-vindo (a) </h1>
           <OrkutNostalgicIconSet />
        </Box>
        <Box>
        <h2 className="subTitle">O que voc?? deseja fazer?</h2>
        <form onSubmit={function handleCriaComunidade(e){
          e.preventDefault();

          const dadosDoForm = new FormData(e.target)

          const comunidade = {
            title: dadosDoForm.get('title'),
            imageUrl: dadosDoForm.get('image') ,
            creatorSlug: usuarioAleatorio,

          }

          fetch('/api/comunidades', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(comunidade)
          })
          .then(async(response) => {
            const dados = await response.json();
            console.log(dados.registroCriado);
            const comunidade = dados.registroCriado;
            const comunidadesAtualizadas = [...comunidades, comunidade]
            setComunidades(comunidadesAtualizadas)
            
          })
         
          
          
        }}>
          <div>
          <input placeholder="Qual vai ser o nome da sua comunidade?" name="title" aria-label="Qual vai ser o nome da sua comunidade?" type="text"/>
          </div>

          <div>
          <input placeholder="Coloque uma URL para usarmos de capa" name="image" aria-label="Coloque uma URL para usarmos de capa"/>
          </div>
          <button>
            Criar Comunidade

          </button>
        </form>

      </Box>
      </div>

      <div className="profileRelationsArea"  style={{ gridArea: 'profileRelationsArea' }}>

      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          Pessoas da Comunidade ({pessoasFavoritas.length})
          </h2>
          <ul>
          {pessoasFavoritas.map((itemAtual) =>{
            return(
              <li key={itemAtual}>
              <a href={`/users/${itemAtual}`}>
              <img src={`https://github.com/${itemAtual}.png`} />
              <span>{itemAtual}</span>
              
              </a>
              </li>
            )
          })}
          </ul>
        </ProfileRelationsBoxWrapper>

        
        <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          Comunidades ({comunidades.length})
          </h2>
          <ul>
          {comunidades.map((itemAtual) =>{
            return(
              <li key = {itemAtual.id}>
              <a href={`/comunities/${itemAtual.id}`}>
                <img src={itemAtual.imageUrl} />
             
              <span>{itemAtual.title}</span>
            
              </a>
              </li>
            )
          })}
          </ul>
        </ProfileRelationsBoxWrapper>
      </div>
    </MainGrid>
    </>
  )
}


export async function getServerSideProps(context){
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth',{
    headers: {
      Authorization: token
    }
  })
  .then((resposta) => resposta.json())

  if(!isAuthenticated){
    return{
      redirect:{
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);

  return{
    props: {
      githubUser
    },
  }
}