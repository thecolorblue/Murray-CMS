# Murray CMS

Very early version of a blog using nodejs and mongodb. It is designed to be simple, flexible, and take advantage of some of the features of mongodb, like the ability to save data to the db without an structure. 

## Getting Started

You need to setup your mongodb by hand. This isn't as tricky as it sounds since there is not much going on right now. 
after you enter mongo:

    use murray // opens murry db
    // create settings
    settings = {name:'postcounter', postcounter:0}
    db.settings.save(settings)
    // create first user
    // the only thing that is really required is name and pass
    admin = {id:1, name:'admin', pass:'secretpassword', 'email':'you@yourdomain.com'}
    db.users.save(admin)


And you should be all set! Mongo should create everything else you need as you go along. 

If you run into any problems create an issue at https://github.com/thecolorblue/Murray-CMS.
