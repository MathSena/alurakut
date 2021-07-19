
import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequest(request, response){
    if(request.method === 'POST'){
        const TOKEN = '1c0ed495ab148f36da885c8f3a9457'
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "977041",
            ...request.body,
           // title: "Comunidade de teste",
            //"imageUrl": "https://github.com/mathsena.png",
            //creatorSlug: "mathsena"
        })

        console.log(registroCriado)
        response.json({
            dados: 'Algum dado',
            registroCriado: registroCriado,
    })
    return;

    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })


}