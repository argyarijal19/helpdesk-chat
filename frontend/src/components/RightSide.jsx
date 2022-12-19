import React from 'react';
import { FaPhoneAlt, FaRocketchat, FaVideo, FaArrowLeft, FaBars,FaTimes } from 'react-icons/fa';
import FriendInfo from './FriendInfo';
import Message from './Message';
import MessageSend from './MessageSend';

const RightSide = (props) => {

    const {currentfriend, inputHandle, newMessage, sendMessage, message, scrollRef, emojiSend, imageSend, activeUser, typingMessage} = props;


  return (
    <div className='col-9'>
        <div className='right-side'>
            <input type='checkbox' id='dot' />
            <div className='row'>
                    <div className='message-send-show'>
                        <div className='header'>
                            <div className='image-name'>
                                <div className='name'>
                                    <h3 style={{padding : "10px"}}>  {currentfriend.userName}</h3>
                                </div>
                            </div>
                            
                        </div>
                        <Message message={message} currentfriend={currentfriend} scrollRef={scrollRef} typingMessage={typingMessage} />
                        <MessageSend inputHandle={inputHandle} newMessage={newMessage} sendMessage={sendMessage} emojiSend={emojiSend} imageSend={imageSend} />
                </div>

            </div>
        </div>
    </div>
  )
}

export default RightSide