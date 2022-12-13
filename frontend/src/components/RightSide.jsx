import React from 'react';
import { FaPhoneAlt, FaRocketchat, FaVideo } from 'react-icons/fa';

const RightSide = () => {
  return (
    <div className='col-9'>
        <div className='right-side'>
            <div className='row'>
                <div className='col-8'>
                    <div className='message-send-show'>
                        <div className='header'>
                            <div className='image-name'>
                                <div className='image'>
                                    <img src='/image/822scoFDm.jpg' alt='' />
                                </div>
                                <div className='name'>
                                    <h3>Argya Rijal</h3>
                                </div>
                            </div>
                            <div className='icons'>
                                <div className='icon'>
                                    <FaPhoneAlt />
                                </div>
                                <div className='icon'>
                                    <FaVideo />
                                </div>
                                <div className='icon'>
                                    <FaRocketchat />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-4'>
                    User About Page
                </div>
            </div>
        </div>
    </div>
  )
}

export default RightSide