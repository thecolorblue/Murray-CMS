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

If you run into any problems create an issue at https://github.com/thecolorblue/Murray-CMS

## Content types

Murray comes with a 'blogpost' content type already setup for you. It is in the ./murray/ctypes folder. If you add another .js file, and use blogpost as a template, you can make other content types. Unfortuneatly, you can only use text, no files yet. You should be able to make a copy and then play around with what you can do as far as extra fields and views. 

## Plugins

This folder will eventually hold any add-ons that someone would want to write that lay on top of Murray. 

Examples:
 - HTML processor (jade, markdown)
 - CSS handling (adding bits of css to template, or processing SASS)
 - extending admin interface

All of these have not been built yet, but would be really cool right?

## Theme

Right now, the theme folder only holds a template.html file that all of the other parts get put into right before the response is sent back. 

The next step is to allow for the template.html file be split up into sidebar.html and footer.html that would extend template. I also want to add an event loop to allow for jade or markdown plugins. 


