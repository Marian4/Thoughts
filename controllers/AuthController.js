'use strict'

const User = require('../models/User')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const flash = require('express-flash')

class AuthController{
    static async login(req, res){
        res.render('auth/login')
    }

    static async loginPost (req, res){
        const {email, password} = req.body

        const user = await User.findOne({where: {email: email}})

        if (!user){
            req.flash('message', 'Usuário não encontrado no sistema.')
            res.render('auth/login')
            return
        }

        if (!bcrypt.compareSync(password, user.password)){
            req.flash('message', 'Senha incorreta.')
            res.render('auth/login')
            return
        }

        req.session.userid = user.id
        req.flash('message', `Bem-vindo de volta, ${user.name}.`)
        req.session.save(() => {
            res.redirect('/')
        })

    }

    static async register (req, res){
        res.render('auth/register')
    }
    static async registerPost(req, res){
        const {name, email, password, passwordConfirm} = req.body
        let err;
        if (password !== passwordConfirm) err = "Os campos de senha e confirmação de senha não conferem, tente novamente."
        if (await User.findOne({where: {email: email}})) err = "O email informado já está em uso, tente novamente."
        if (!/\w+@\w+.\w+/.test(email)) err = "Insira um email válido para continuar."
        if (err) {
            req.flash('message', err)
            res.render('auth/register')
            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        const user = {name, email, password: hashedPassword}
        try{
            const createdUser = await User.create(user)
            req.session.userid = createdUser.id
            req.flash('message', "Concluímos seu cadastro com sucesso!")
            req.session.save(() => {
                res.redirect('/')
            })
        }catch(err){
            console.log(err)
        }
    }

    static logout (req, res){
        req.session.destroy()
        res.redirect('/')
    }
}


module.exports = AuthController