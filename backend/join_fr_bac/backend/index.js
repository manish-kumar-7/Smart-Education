import express from'express'
const app=express();
// app.get('/',(req,res)=>{
//     res.send("server is ready");
// });
app.get('/api/jokes',(req,res)=>{
    const jokes = [
        {
          id: 1,
          title: "Why did the developer go broke?",
          description: "Because he used up all his cache."
        },
        {
          id: 2,
          title: "Why don’t programmers like nature?",
          description: "It has too many bugs."
        },
        {
          id: 3,
          title: "What is a programmer's favorite hangout place?",
          description: "The Foo Bar."
        },
        {
          id: 4,
          title: "How do you comfort a JavaScript bug?",
          description: "You console it."
        },
        {
          id: 5,
          title: "Why did the JavaScript developer stay calm?",
          description: "Because he didn’t let ‘this’ get to him."
        }
      ];
      res.send(jokes);
      
})

const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`srevre  at http://localhost:${port}`);
})