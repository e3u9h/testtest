import React, { useState, useRef, useEffect } from 'react';
import "./css/Chatbox.css";
import { faPaperclip, faSmile, faPaperPlane, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messageContainerRef = useRef(null);

  useEffect(() => {
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }, [messages]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendButtonClick = () => {
    if (inputValue === '') {
      return;
    }
    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sent: true,
    };
    setMessages((messages) => [...messages, newMessage]);
    setInputValue('');
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendButtonClick();
    }
  };

  const handleWithdrawButtonClick = (messageId) => {
    setMessages((messages) =>
      messages.filter((message) => message.id !== messageId)
    );
  };

  return (
    <div class="container py-5">

      <div class="row">
        <div class="col-md-12">

          <div class="card" id="chat3" style={{borderRadius: "15px"}}>
            <div class="card-body">

              <div class="row">
                <div class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">

                  <div class="p-3">

                    <div class="input-group rounded mb-3">
                      <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search"
                        aria-describedby="search-addon" />
                      <button type="button" class="btn btn-light btn-lg btn-rounded float-end"><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></button>

                    </div>

                  </div>

                </div>


              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
 
export default ChatBox;