import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Input from './input'
import user_img from './user_img.jpg'
import man from './man.jpg'
import profile_user from './profile_user.jpg'
import Log_out from "./Log_out.png"
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { io } from "socket.io-client";







const Dashboard = () => {
	const navigate = useNavigate();

	const [conversations, setConversations] = useState([])
	const [messages, setMessages] = useState({})
	const [message, setMessage] = useState('')
	const [users, setUsers] = useState([])
	const [onlineUser, setonlinetUser] = useState([])
	const [socket, setSocket] = useState(null)


	const messageRef = useRef(null)

	const { name, user_id } = useParams()

	useEffect(() => {
		const socket = io("https://chathutmessageappbackend.onrender.com")
		setSocket(socket)
		return () => {
			socket.disconnect();
		};
	}, []);






	useEffect(() => {

		socket?.emit('addUser', user_id);

		socket?.on('getUsers', users => {
			fetchUsers();
			setonlinetUser(users);
		})

		socket?.on('getMessage', data => {
			fetchConversations();
			setMessages(prev => ({
				...prev,
				mssg: (prev.mssg && prev.mssg.length > 0) || (prev.mssg && prev.mssg.length === 0 && data.senderId === user_id) || (prev.mssg && prev.mssg.length === 0 && prev.receiver.receiverId === data.senderId) ? [...prev.mssg, { user: data.user, message: data.message }] : []

			}));
		});

		socket?.on('alreadyExist', () => {
			toast.success("Already Same Account Open in Another Tab", {
				position: "top-center"
			})
			setTimeout(movePage, 1500)
		});


	}, [socket])




	useEffect(() => {
		messageRef?.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages?.mssg])


	const fetchConversations = async () => {

		await axios.get(`https://chathutmessageappbackend.onrender.com/api/user/getConversation/${user_id}`).then(response => {
			setConversations(response.data)
		})
			.catch(error => {
				alert(error.response.data)
			})
	}
	const fetchUsers = async () => {
		await axios.get(`https://chathutmessageappbackend.onrender.com/api/user/allpeople/${user_id}`).then(response => {
			setUsers(response.data)
		})
			.catch(error => {
				alert(error.response.data)
			})
	}

	useEffect(() => {
		fetchConversations()
		fetchUsers()
	}, [])





	const fetchMessages = async (conversationId, receiver) => {
		await axios.get(`https://chathutmessageappbackend.onrender.com/api/user/getmessege/${conversationId}?senderId=${user_id}&receiverId=${receiver?.receiverId}`).then(response => {
			const messagesData = response.data;
			setMessages({ mssg: messagesData, receiver, conversationId });

		})

			.catch(error => {
				alert(error.response.data);
			});
	}

	const sendMessage = async (e) => {
		socket?.emit('sendMessage', {
			senderId: user_id,
			receiverId: messages?.receiver?.receiverId,
			message,
			conversationId: messages?.conversationId
		});

		const conversationId = messages?.conversationId;
		const senderId = user_id;
		const messege = message;
		const receiverId = messages?.receiver?.receiverId;
		const Sendmssg = { conversationId, senderId, messege, receiverId }
		setMessage('')
		await axios.post(`https://chathutmessageappbackend.onrender.com/api/user/postmssg`, Sendmssg).then(response => {
			console.log("Message posted")
		})
			.catch(error => {
				alert(error.response.data)
			})


	}
	const movePage = () => {
		navigate("/")
	}

	const LogOut = async () => {
		axios.get("https://chathutmessageappbackend.onrender.com/api/user/logout").then(response => {
			setTimeout(movePage, 1500)
			toast.success("Logout Successful", {
				position: "top-center"
			})
		})
			.catch(error => {
				console.log(error)
			})
	}
	return (
		<>
			<div className='w-screen flex'>
				<div className='2x1:w-[25%] x1:w[30%] lg:w-[37%] md:w-[40%] sm:w[35%] h-screen bg-secondary overflow-scroll'>
					<div className='flex items-center my-10 mx-5'>
						<div><img class="lg:h-full lg:w-17 md:h-full md:w-20 sm:h-full sm:w-16 rounded-full border border-light " src={profile_user} /></div>
						<div className='ml-6'>
							<h3 className='text-2xl'>{name}</h3>
							<p className='text-lg font-dark'>My Account</p>
							<div><button onClick={LogOut}><img src={Log_out} width={30} height={30} className="bg-primary rounded-full border border-light" /></button></div>
						</div>
					</div>
					<hr />
					<div className='mx-14 mt-10'>
						<div className='text-primary text-lg'>Messages</div>
						<div>
							{
								conversations.length > 0 ?
									conversations.map(({ user, conversationId }) => {
										return (
											<div className='flex items-center py-8 border-b border-b-grey-457'>
												<div className='cursor-pointer flex items-center' onClick={() => fetchMessages(conversationId, user)}>
													<div><img class="lg:h-full lg:w-14 md:h-full md:w-11 sm:h-full sm:w-14 rounded-full border border-light " src={man} /></div>
													<div className='ml-6'>
														<h3 className='text-lg font-semibold'>{user?.fullName}</h3>
														<p className='text-sm font-dark text-black-1000'>
															{onlineUser.find((usr) => usr.userId === user.receiverId) ? 'Online' : 'Offline'}
														</p>
													</div>
												</div>
											</div>

										)
									}) : <div className='text-center text-lg font-semibold mt-24'>No Conversations</div>
							}
						</div>
					</div>
				</div>

				<div className='x1:w-[75%] md:w-[50%] sm-[45%] h-screen bg-white flex flex-col items-center'>
					{
						messages?.receiver?.fullName &&
						<div className='lg:w-[75%] md:w-[97%] sm:w[40%] bg-bar lg:h-[75px] md:h-[95px] sm:h[60%] my-14 rounded-full flex items-center px-14 py-2'>
							<div><img class="lg:h-full lg:w-14 md:h-full md:w-20 sm:h-full sm:w-40 rounded-full border border-light " src={man} /></div>
							{

								<div className='ml-6 mr-auto'>
									<h3 className='text-lg'>{messages?.receiver?.fullName}</h3>
									<p className='text-sm font-dark text-gray-600'>
										{messages?.receiver?.email} -{' '}
										{onlineUser.find((usr) => usr.userId === messages?.receiver?.receiverId) ? 'Online' : 'Offline'}
									</p>
								</div>

							}
							<div className='cursor-pointer'>
								<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-phone-outgoing" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
									<line x1="15" y1="9" x2="20" y2="4" />
									<polyline points="16 4 20 4 20 8" />
								</svg>
							</div>
						</div>



					}
					<div className='md:h-[75%] w-full overflow-scroll shadow-sm'>
						<div className='p-14'>
							{
								messages?.mssg?.length > 0 ?
									messages.mssg.map(({ message, user: { id } = {} }) => {
										if (id === user_id) {
											return (
												<>

													<div className={`lg:max-w-[230px] md:max-w-[100px] rounded-b-xl p-4 mb-6 bg-text  break-words text-black rounded-tl-xl ml-auto`}>{message}</div>

													<div ref={messageRef}></div>
												</>

											);
										} else
											if (messages?.receiver?.receiverId === id) {
												return (
													<>

														<div className={`lg:max-w-[230px] md:max-w-[100px] rounded-b-xl p-4 mb-6 bg-rcvtext break-words rounded-tr-xl `}>{message}</div>

														<div ref={messageRef}></div>

													</>

												);
											}

									})
									: <div className='text-center text-lg font-semibold mt-24'>No Messages or No Conversation Selected</div>
							}
						</div>
					</div>

					{
						messages?.receiver?.fullName &&
						<div className='p-14 w-full flex items-center'>
							<Input placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} className='w-[75%]' inputClassName='p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none' />
							<div className={`ml-4 p-2 cursor-pointer bg-bar rounded-full ${!message && 'pointer-events-none'}`} onClick={() => sendMessage()}>
								<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<line x1="10" y1="14" x2="21" y2="3" />
									<path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
								</svg>
							</div>
							<div className={`ml-4 p-2 cursor-pointer bg-bar rounded-full ${!message && 'pointer-events-none'}`}>
								<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<circle cx="12" cy="12" r="9" />
									<line x1="8" y1="12" x2="15" y2="12" />
									<line x1="12" y1="9" x2="12" y2="15" />
								</svg>
							</div>
						</div>
					}
				</div>



				<div className='2x1:w-[25%] x1:w[30%] lg:w-[37%] md:w-[40%] sm:w[30%] h-screen bg-light px-8 py-16 overflow-scroll'>
					<div className='text-primary text-lg '>People</div>
					<div>
						{
							users.length > 0 ?
								users.map(({ user }) => {
									return (
										<div className='flex items-center py-8 border-b border-b-gray-300'>
											<div className='cursor-pointer flex items-center' onClick={() => fetchMessages('new', user)}>
												<div><img class="lg:h-full lg:w-14 md:h-full md:w-12 sm:h-full sm:w-16 rounded-full border border-light " src={user_img} /></div>
												<div className='ml-6'>
													<h3 className='text-lg font-semibold'>{user?.fullName}</h3>
													<p className='text-sm font-dark text-black-1000'>
														{onlineUser.find((usr) => usr.userId === user.receiverId) ? 'Online' : 'Offline'}
													</p>
												</div>
											</div>
										</div>
									)

								}) : <div className='text-center text-lg font-semibold mt-24'>No User Available</div>
						}
					</div>
				</div>
			</div>

			<ToastContainer />


		</>

	)
}

export default Dashboard;