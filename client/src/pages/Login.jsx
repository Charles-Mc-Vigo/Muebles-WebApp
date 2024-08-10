import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Login() {
	const [formData, setFormData] = useState({
		email:'',
		password:''
	});
	const navigate = useNavigate();
const handleChange = (e) => {
	const {id,value} = e.target;
	setFormData({...formData,[id]:value});
	console.log(formData);
}
const handleSubmit = async (e) => {
	e.preventDefault();

	console.log("Form data to be submitted:", { ...formData });

	try {
		const response = await axios.post('http://localhost:3000/api/users/login',{
			...formData
		})
		console.log(response);
		//store token to local storage
		if(response){
			localStorage.setItem('authToken', response.data.token);
			alert('Logged in successful')
			navigate('/home')
		}else{
			alert('Logged in unsuccessful')
		}

	} catch (error) {
		console.error("Log in error", error.response?.data || error.message);
		alert(error.response?.data?.message || error.message || "Log in failed");
	}
}

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-center font-semibold my-7 text-3xl">Welcome to Muebles!</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					type="email"
					placeholder="Email"
					id="email"
					required
					onChange={handleChange}
					className="bg-slate-100 p-3 rounded-lg"
				/>
				<input
					type="password"
					placeholder="Password"
					id="password"
					required
					onChange={handleChange}
					className="bg-slate-100 p-3 rounded-lg"
				/>

				<button
					type="submit"
					className="p-3 bg-slate-500 rounded-lg text-slate-50 font-bold uppercase hover:opacity-80 disabled:opacity-70"
				>
					Log In
				</button>
				<div>
					<p>
						Don't have an account?{" "}
						<Link to="/signup">
							<span className="text-blue-500">Sign Up</span>
						</Link>
					</p>
				</div>
			</form>
		</div>
	);
}
