import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import {AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault} from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';



function ProfileSideBar(propriedades){
  return(
  <Box>
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

export default function Home() {
  const usuarioAleatorio = 'mathsena';
  const [comunidades, setComunidades] = React.useState([{
    id: '738563267562390564896',
    title: 'Fora Bolsonaro',
    image: 'https://static.vakinha.com.br/uploads/vakinha/image/1912444/Bolsonaro_Genocida.jpg?ims=700x410'

  }]);
  // const comunidades =['Alurakut'];
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'

  ]


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
        <h2 className="subTitle">O que você deseja fazer?</h2>
        <form onSubmit={function handleCriaComunidade(e){
          e.preventDefault();

          const dadosDoForm = new FormData(e.target)

          const comunidade = {
            id: new Date().toISOString,
            title: dadosDoForm.get('title'),
            image: dadosDoForm.get('image') ,

          }
         
          const comunidadesAtualizadas = [...comunidades, comunidade]
          setComunidades(comunidadesAtualizadas)
          
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
          Comunidades ({comunidades.length})
          </h2>
          <ul>
          {comunidades.map((itemAtual) =>{
            return(
              <li key = {itemAtual.id}>
              <a href={`/users/${itemAtual.title}`}>
                <img src={itemAtual.image} />
             
              <span>{itemAtual.title}</span>
              

              </a>
              </li>
            )
          })}
          </ul>


        </ProfileRelationsBoxWrapper>



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
        <Box>
          Comunidades
        </Box>
      </div>
      
    </MainGrid>
    </>
  )
}
