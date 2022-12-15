import React, { useEffect, useState, useRef }from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { FaEdit, FaEllipsisH, FaSistrix } from 'react-icons/fa';
import ActiveFriend from './ActiveFriend';
import Friends from './Friends';
import RightSide from './RightSide';
import { getFriends, messageSend, getMessage, imageMessageSend } from '../store/actions/messengerActions';
import {io} from 'socket.io-client';




const Messanger = () => {



    const scrollRef = useRef();
    const socket = useRef();

    const {friends, message} = useSelector(state => state.messenger);
    const {myInfo} = useSelector(state => state.auth);
    const [currentfriend, setCurrentFriend] = useState('');
    const [newMessage, setnewMessage] = useState('');
    const [activeUser, setActiveUser] = useState([]);
    const [socketMessage, setSocketMessage] = useState('');

    useEffect(() => {
        socket.current = io('ws://localhost:8000');
        socket.current.on('getMessage', (data) => {
            setSocketMessage(data);
        })
    }, []);

    useEffect(() => {
        if(socketMessage && currentfriend){
            if(socketMessage.senderId === currentfriend._id && socketMessage.recieverId === myInfo.id){
                dispatch({
                    type: 'SOCKET_MESSAGE',
                    payload: {
                        message: socketMessage
                    }
                })
            }
        }
        setSocketMessage('');
    }, [socketMessage]);

    useEffect(() => {
        socket.current.emit('addUser', myInfo.id, myInfo )
    }, []);

    useEffect(() => {
        socket.current.on('getUser', (users) =>{
            const filterUser = users.filter(u => u.userId !== myInfo.id)
            setActiveUser(filterUser);
        })
    }, []);

    const inputHandle = (e) => {
        setnewMessage(e.target.value);
    }

    const sendMessage = (e) => {
        e.preventDefault();
        const data = {
            senderName: myInfo.userName,
            recieverId: currentfriend._id,
            message: newMessage ? newMessage : '😊'
        }

        socket.current.emit('sendMessage', {
            senderId: myInfo.id,
            senderName: myInfo.userName,
            recieverId: currentfriend._id,
            time: new Date(),
            message: {
                text: newMessage ? newMessage : '😊',
                image: ''
            }
        })
        dispatch(messageSend(data));
        setnewMessage('');
    }
    console.log(currentfriend);
    
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getFriends());
    }, []);


    useEffect(() => {
        if(friends && friends.length > 0){
            setCurrentFriend(friends[0])
        }
    }, [friends]);



    useEffect(() => {
        dispatch(getMessage(currentfriend._id))
    }, [currentfriend?._id]);



    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [message]);


    const emojiSend = (emu) => {
        setnewMessage(`${newMessage}` + emu);
    }

    const imageSend = (e) =>{

        if(e.target.files.length !== 0){
            const imageName = e.target.files[0].name;
            const newImageName = Date.now() + imageName;

            const formData = new FormData();
            formData.append('senderName', myInfo.userName);
            formData.append('imagename', newImageName);
            formData.append('recieverId', currentfriend._id);
            formData.append('image', e.target.files[0]);

            dispatch(imageMessageSend(formData));
            console.log(newImageName);
        }
        
        console.log(e.target.files[0])
    }

  return (
    <div className='messenger'>
        <div className='row'>
            <div className='col-3'>
                <div className='left-side'>
                    <div className='top'>
                        <div className='image-name'>
                            <div className='image'>
                                <img src={`/image/${myInfo.image}`} alt='' />
                            </div>
                            <div className='name'>
                                <h3>{myInfo.userName}</h3>
                            </div>
                        </div>
                        <div className='icons'>
                            <div className='icon'>
                                <FaEllipsisH />
                            </div>
                            <div className='icon'>
                                <FaEdit />
                            </div>
                        </div>
                    </div>
                    <div className='friend-search'>
                        <div className='search'>
                            <button><FaSistrix /></button>
                            <input type="text" placeholder='Search' className='form-control'/>
                        </div>
                    </div>
                    <div className='active-friends'>
                        {
                            activeUser && activeUser.length > 0 ? activeUser.map(u => <ActiveFriend user={u} /> ) : ''
                        }
                        
                    </div>
                    <div className='friends'>
                        {
                            friends && friends.length>0 ? friends.map(
                                (fd) => 
                                    <div onClick={() => setCurrentFriend(fd)} className={currentfriend._id === fd._id ? 'hover-friend active' : 'hover-friend'}>
                                        <Friends friend={fd} />
                                    </div>
                            ) : 'No Friends'
                        }
                    </div>
                </div>
            </div>
            {
                currentfriend ? <RightSide currentfriend={currentfriend} inputHandle={inputHandle} newMessage={newMessage} sendMessage={sendMessage} message={message} scrollRef={scrollRef} emojiSend={emojiSend} imageSend={imageSend} activeUser={activeUser} /> : 'Please Select Your Friend'
            }
        </div>
    </div>
  )
}

export default Messanger