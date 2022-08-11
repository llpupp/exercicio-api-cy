/// <reference types= "cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('llp_qa@ebac.com.br', 'teste').then(tkn => { token = tkn })
     });

     it.only('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.body.usuarios[0].email).to.equal('reginapupp_qa@ebac.com.br')
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(12)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let usuario = `usuario` + `${Math.floor(Math.random() * 100000)}`
          let email = `${usuario}@qa.com.br`
          let senha = `teste ${Math.floor(Math.random() * 100000)}`
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": usuario,
                    "email": email,
                    "password": senha,
                    "administrador": 'true'
               }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it('Deve validar email inválido', () => {
          cy.request({
               method: 'POST',
               url: 'login',
               body: {
                    "email": "llpup_qa@ebac.com.br",
                    "password": "902ut$$"
               },
               failOnStatusCode: false
          }).then((response) => {
               expect(response.status).to.equal(401)
               expect(response.body.message).to.equal('Email e/ou senha inválidos')
          })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[0]._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    headers: {authorization: token},
                    body:{
                         "nome": "Regina Pupp",
                         "email": "reginapupp_qa@ebac.com.br",
                         "password": "teste",
                         "administrador": "true"
                       }
               }).then(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let usuario = `usuario` + `${Math.floor(Math.random() * 100000)}`
          let email = `${usuario}@qa.com.br`
          cy.cadastrarUsuarios(token, usuario, email, 'teste', 'false')
          .then(response => {
               let id = response.body._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,
                    headers: { authorization: token}
               }).then(response => {
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
               })
          })
     });
})
