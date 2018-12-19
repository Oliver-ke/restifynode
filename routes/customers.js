const errors =require('restify-errors')
const Customer = require('../models/Customer')

module.exports = server =>{
    //get customers from the database
    server.get('/customers', async(req,res,next) =>{
        try {
            const customers = await Customer.find({});
            res.send(customers)
            next();
        } catch (err) {
            return next(new errors.InvalidContentError(err));
        }  
    });

    // gets a single customer
    server.get('/customers/:id', async(req,res,next) =>{
        const id = req.params.id;
        try {
            const customer = await Customer.findById(id);
            res.send(customer)
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`there is no customer with the id of ${id}`));
        }  
    });

    //add customers to database
    server.post('/customers', async(req,res,next)=>{
        //check  for content type
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("expects 'application/json' "))
        }
       const { name,email,balance } = req.body;
        const customer = new Customer({
            name,
            email,
            balance
        });
        try {
            const newCustomer = await customer.save();
            res.send(201);
            next();
        } catch (err) {
            return next(new errors.InternalError(err.message))
        }
    });

    // updating customers
    server.put('/customers/:id', async(req,res,next)=>{
        //check  for content type
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("expects 'application/json' "))
        }
       
        try {
            const customer = await Customer.findOneAndUpdate({_id: req.params.id},req.body)
            res.send(200);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`there is no customer with the id of ${req.params.id}`));
        } 
    });

    //Delete customers
    server.del('/customers/:id', async(req,res,next) =>{
        const id = req.params.id
        try {
            const customer = await Customer.findOneAndDelete({_id: id});
            res.send(204);
            next();
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`there is no customer with the id of ${id}`));
        } 
    })

}