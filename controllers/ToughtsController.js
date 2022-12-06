'use strict'

const Tought = require('../models/Tought')
const User = require('../models/User')
const { formatDate } = require('../helpers/toughts')

class ToughtsController{
    static create (req, res) {
        res.render('toughts/create')
    }

    static async createPost (req, res){
        try{
            const tought = {
                tought: req.body.tought,
                UserId: req.session.userid
            }
            await Tought.create(tought)
            req.flash('message', 'Pensamento publicado com sucesso.')
            req.session.save(() => {
                res.redirect('/')
            })
        }catch(err){
            console.log(err)
        }
    }

    static async edit(req, res){
        let tought = await Tought.findOne({where: {id: req.params.toughtId}})
        tought = tought.toJSON()
        res.render('toughts/edit', {tought: tought.tought, toughtId: tought.id})
    }

    static async editPost(req, res){
        const tought = {
            tought: req.body.tought
        }
        await Tought.update(tought, {where: {id : req.params.toughtId}})
        req.flash('message', 'Pensamento atualizado com sucesso.')
        req.session.save(() => {
            res.redirect('/toughts/dashboard')
        })
    }

    static async delete(req, res){
        await Tought.destroy({where: {id: req.params.toughtId, UserId: req.session.userid}})
        req.flash('message', 'Pensamento excluído com sucesso.')
        req.session.save(() => {
            res.redirect('/toughts/dashboard')
        })
    }

    static async getAllToughts(req, res){
        let toughts = await Tought.findAll({include: User, order: [['updatedAt', 'DESC']]})
        toughts = toughts.map((tought) => {
            tought = tought.toJSON()
            tought.username = tought.User.name
            tought.createdAt = formatDate(tought.updatedAt)
            return tought
        })
        res.render('home', {layout: 'main', toughts})
    }

    static async dashboard (req, res){
        const user = await User.findOne({where: {id: req.session.userid}})
        let userToughts = await Tought.findAll({where: {userId: req.session.userid}, order: [['updatedAt', 'DESC']]})
        userToughts = userToughts.map((tought) => {
            tought = tought.toJSON()
            tought.username = user.name
            tought.createdAt = formatDate(tought.updatedAt)
            tought.options = true
            return tought
        })
        res.render('toughts/dashboard', {layout: 'main', userToughts})
    }

}

module.exports = ToughtsController