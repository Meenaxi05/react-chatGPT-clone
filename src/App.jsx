import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import "./index.css";

const configuration = new Configuration({
  organization: "org-id",
  apiKey: "apikey",
});

delete configuration.baseOptions.headers["User-Agent"];

const openai = new OpenAIApi(configuration);

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();
    setIsTyping(true); // when its true it displays the "Typing"
    //keep track of this message before sending it
    let msgs = chats; //keeping tracks of the chats using messages
    msgs.push({ role: "user", content: message }); // pushing new messages
    setChats(msgs); //updating chats

    scrollTo(0, 1e10);
    setMessage("");

    // setChats(...chats, [{ role: "user", content: message }]);
    // setMessage("");

    //calling endpoints
    await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "you are chatgpt.",
          },
          ...chats,
        ],
      })
      .then((result) => {
        msgs.push(result.data.choices[0].message);
        setChats(msgs); //updating chat history
        setIsTyping(false); //typing text disappers from our screen
        scrollTo(0, 1e10);

        // console.log(result);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold underline py-10">React ChatGPT App</h1>

      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
                <span>{chat.role}</span>
                <span> : </span>
                <span>{chat.content}</span>
              </p>
            ))
          : ""}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p className="pb-5">
          <i>generating</i>
        </p>
      </div>

      <form onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          autoComplete="off"
          name="message"
          value={message}
          placeholder="Enter a Message"
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
}

export default App;
