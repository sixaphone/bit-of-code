---
title: "About CRUDs"
description: "Some terms and explanations for beginners to better understand CRUDs"
publishedAt: 2025-01-09
category: "Short Read"
---

# Intro

Usually cruds are simple types of application. The basic idea of them is simple.
- You have an entity
- You save the entity to database
- Read from database
- Update database
- Eventually you soft or hard delete it

Now this all is simple, but often times we have complex application, business and other rules that the object needs to implement. And with the jungle of framework and implementation logic its good to have a basic template to go by. 

## App and business rules

Application rules are most common and easy to understand. Your app has a basic rule before implementing something fully. Some examples:

1. I need this image to exits on file system before storing it
2. The user needs to be an admin to do this action
3. Record needs to be saved first before being updated
...And so on

Business logic is a bit more focused, but still very simple to understand. This logic is mostly tied to a domain. Now what is domain. It is a structural part of the system. CRUD focuses on persisting multiple types of entities to database and every save, delete and update follows same principels, but what about the entities themselves. What if for example I have a post entity that needs to have a thumbnail which references to a external resource. That is not something so important to the database as it is just a string, but for business logic it is. From here we get that domain/business logic is logic or rules we apply to the entities we persist in our system. Some examples:

1. Post thumbnail needs to be an url to external resource
2. Name of user needs to be in a certain format
3. Email must be of domain `example.dom`
...And so on

So we see that we divide our logic by app and business. Every business consists of domains and they all implement their business logic and then from there they integrate themselves into the application logic from there.

The usuall better approach is to first implement your domain model before building app logic around it. This means that you domain model does all the business logic for you then your app adapts to the domain and not the other way around and in the end your app is built to work with those domains and not change them.

## SOLID principels

This is something that you will hear about anywhere. It is a pretty hot topic, but there is sense to it. I will not go too deep into `SOLID` and what each letter represents but in plain English:

- S for single responsibility means: your class is responsible for its own methods and does not do anything else, instead it has another class for that.
    - Example: I have a class for saving users called `UserService`. The service will need to validate the user object before saving. Now I could write a validate method in the service and it will get the job done, but should service really know how to validate. In the end the service works with the database. Read, create, update, delete and now validate? Should I put so much pressure on this service. Why not create a class for validation like `UserValidator`. Then my service can use this class to validate before saving. This way no class has too much responsibility and is kept simple and maintainable.
- O for open/closed means: if I have a working class that does its job and I need to do something new around it I will create a child class.
    - Example: I have a validator to validate normal users. The before mentioned `UserValidator`. Now I get the request to add new types of users. `AnonymouseUsers`. Well I know the validator works very well so should I got to validate and if else it. Well I could, but will the service work as it should after that and do I have tests to ensure that? Most likely not. However, lets say I make `AnonymouseUserValidator` and it inherits the base validator. That way I can make new stuff and I do not have to worry about the old code getting buggy.
- L for liskov substitution principle: the worst of them, but in short if I have a parent and child class can I use the parent class everywhere as type and just instance child object.
    - Example: can I say everywhere in my code `Parent obj = new Child()` and have my code work as expected? If yes then it is fulfilled else that means taht child migth not be a proper sub type. Now this is pretty hard to get right and often can be played with, but we need to make sure to add a good layer of abstraction to our classes to make the code little coupeled as possible. A good quote for this would be from `Uncle Bob`: "We have a duck-ish thing. However, if it looks like a duck, quacks like a duck, but needs batteries then we have the wrong abstraction".
- I for interface Segregation: means that all your interfaces should be broken down into smaller simpler ones.
    - Example: you have the usb port. Now the usb port is as universal as it gets and with it you can plug many various electronis. Now instead of making a single port and a single plug for your mouse, keyboard, headphones etc we just make many smaller ones for them and have them be easy to swap. In classes that means that you make a simple interface and break it into less smaller ones. Lets say I have a `ParserService` and I need to parse `html, plain, md etc`. Should I make one service and do all parsing in that one? NO! I make `HtmlParser`, `MdParser`, `PlainParser` for every service with a parse method and they just all `ParsingService`. 
- D for dependency inversion means: that all my classes have a way of doing their tasks  its just the other classes have no idea how.
    - Example: I have my app and I need to generate some random string for something. Now we follow some principles and make a class for that and we just do `new RandomTextMaker()` when ever we need one. After a while we make a better class for that and name it `TrueRandomTextMaker()`, but we have already used `RandomTextMaker` in 500+ places in our code. This will be quiet the refactor here. Instead we now make an interface or abstract called `TextMaker` and have all our future makes implement it. That way we can just say everywhere we use the interface. Our app then knows what code is available, but not how it works making our classes less dependent on each other as usage and concrete implementation have been separated.


All those principels come quite in handy while making an app. Of course we migth end up needing to break some of them at times. They are guidelines more that rules, but using them will make sure our app is nicely maintainable.

## From web request to database

The journey of our record from the moment we make a request to it being in database is quite the path. Well maybe not always, but usually it is. Some people write apps where records are saved in controller and returned from there. Those same people probably do not validate input and are wanted criminals. If your app stores the record as soon as it gets to the controller, well I heard farming pays nicely too.

We need to make sure that our classes which are controllers, services, mappers etc do their job and work together to get our record home safe. Now I am no Alan T., but we can make some base logic that our application follows. Till now we have been using the word `classes` for everything. This is a bit to broad and it would do us good to make distinction with what classes we will be working with. 

The common ones are:
- Controllers 
- Services
- Repositores
- Mappers

They exist usually in every app and for a good reason. They do their job and they do it good and make our app understandable. Before going in depth for each class let me try to graph a neat path for your record to take. This is more of a friendly suggestion rather than a hardcore path that must be used:

`Request -> Dto -> Controller -> Service -> Domain -> Repository -> EntityMapper -> Entity`

Now what does this up mean? 
We have a request. The request contains a DTO object with the request data. Our controller takes the dto and calls the service to handle it. The service parses the request and makes the `Domain` model and from there it tells the repository to save the record. The repository uses a mapper to create an entity model and saves it to database. My suggestion for having domain and entity objects is to have classes which hold business logic for the app in the domain and database logic in entity. So my entity class would have what it needs so that migrations can be created while domain would take care of domain rules and events.

The way back would look something like:

`View <- Controller  <- ViewMapper  <- Service <- Domain <- Repository <- Mapper <- Entity`

And how does this work?
You get the entitiy/ies from database. Use the mapper and repository to create domain model/s. Then your service uses a mapper to create a view model for the request and the controller returns the view back. The view can be json, html or anything really.

This way all services work together to make the crud work and we have a nice flow. No service knows how the others work thaks to SOLID, but they all do their job properly and the app works (hopefully).

## The various classes

I would also like to elaborate a bit more on that each class in the chain should focus on.

1. Controllers: are the entrypoint of every reqeust. They should check if the request containts valid data, if some required are headers are there, if user is authorized and has the right to access route. So they usually do http level checks and do not go too much in how to handle the data. After making sure that the request has a proper type and valid data for that request we have the controller delegate the parsing and so on to a service.

2. Services: hold most of your app logic. They can do minor things like generate a string or more complex like validate, parse and similar. In a sense all classes can be considered services but they usually act as a link for your repository and controller. All of your application level rules are checked in these services before going on to domain. Usually every domain has at leaste one service.

3. Mappers: handle conversion of types from A to B. Two very handy mappers are view and entity mapper. This is another good reason to have domain and entity as two classes. That way domain can act as bridge for all other mappers. We can make a mapper that makes domain->entity and domain->view and they could work together as they all have one model the same. Mappers can also be used between other classes, but we should make sure that we do not add unwanted complication with mappers.

4. Repositories: are the collections you work with in the app. They are your database tables converted to a class. We usually work with arrays in programming. Now imagine a class that holds an array and knows how to add, remove, update, delete and more. These classes usually implement database logic and know how to work with database. The array in question is the databse records and then we just have a bunch of methods to work with the database.

5. Entities: are your database table records. Each record knows what it has concerning properties. They are usually simple classes and simply hold properties and database information.

6. Dtos: are request objects that hold the data needed to handle a request and usually help with validation. They are what the controller recieves and passes on and often hold some form of validation with them for the fields they have. They are your primal source of validation and data needed for the crudening.