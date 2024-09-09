import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
	const [formData, setFormData] = useState({
		firstname: "",
		lastname: "",
		gender: "",
		phoneNumber: "",
		streetAddress: "",
		municipality: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [zipCode, setZipcode] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData({ ...formData, [id]: value });
		if (id === "municipality") {
			setZipcode(zipCodes[value] || "");
		}
	};

	const zipCodes = {
		Boac: 4900,
		Mogpog: 4901,
		SantaCruz: 4902,
		Gasan: 4905,
		Buenavista: 4904,
		Torrijos: 4903,
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				"http://localhost:3000/api/users/signup",
				{
					...formData,
					zipCode,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			alert("Sign up successfully!");
			navigate('/verify-email');
		} catch (error) {
			console.error("Sign up error", error.response?.data || error.message);
			alert(error.response?.data?.message || error.message || "Sign up failed");
		}
	};

	return (
		<div className="min-h-screen flex justify-center items-center">
			<div className="w-full max-w-4xl p-8 mx-4 md:mx-auto bg-white shadow-lg rounded-lg flex flex-col md:flex-row border-4 border-green-200">
				
				<div
					className="hidden md:flex md:w-1/2 items-center bg-contain rounded-l-lg"
					style={{ backgroundImage: `url('/landingimage/LOGO.jpg')` }}
				>
					<div className="flex items-center justify-center w-full bg-gray-500 bg-opacity-50 p-8 rounded-l-lg">
						<div className="text-center text-black">
							<h2 className="text-4xl font-bold mb-4">Sign Up</h2>
							<p className="text-lg">
								Please enter your details to sign up and be part of our great community.
							</p>
							<p className="mt-4">
								Already have an account?{" "}
								<Link to="/login" className="text-blue-500 underline">
									Sign In
								</Link>
							</p>
						</div>
					</div>
				</div>

				<div className="w-full md:w-1/2 p-8">
					<h1 className="text-center font-semibold my-7 text-3xl">
						Welcome to Muebles!
					</h1>
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<input
								type="text"
								placeholder="Firstname"
								id="firstname"
								required
								className="bg-slate-100 p-3 rounded-lg"
								onChange={handleChange}
							/>
							<input
								type="text"
								placeholder="Lastname"
								id="lastname"
								required
								className="bg-slate-100 p-3 rounded-lg"
								onChange={handleChange}
							/>
						</div>
						<select
							id="gender"
							value={formData.gender}
							onChange={handleChange}
							required
							className="bg-slate-100 p-3 rounded-lg"
						>
							<option value="" disabled hidden>
								Gender
							</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</select>
						<input
							type="tel"
							placeholder="+639XXXXXXXXX"
							id="phoneNumber"
							required
							className="bg-slate-100 p-3 rounded-lg"
							onChange={handleChange}
						/>
						<select
							name="municipality"
							id="municipality"
							required
							onChange={handleChange}
							defaultValue={formData.municipality || ""}
							className="bg-slate-100 p-3 rounded-lg"
						>
							<option value="" disabled hidden>
								Select Municipality
							</option>
							<option value="Boac">Boac</option>
							<option value="Mogpog">Mogpog</option>
							<option value="SantaCruz">Santa Cruz</option>
							<option value="Gasan">Gasan</option>
							<option value="Buenavista">Buenavista</option>
							<option value="Torrijos">Torrijos</option>
						</select>
						{formData.municipality && (
							<input
								type="text"
								value={zipCode}
								readOnly
								className="bg-slate-100 p-3 rounded-lg"
								placeholder="Zip Code"
							/>
						)}
						<input
							type="text"
							placeholder="Street Address"
							id="streetAddress"
							required
							className="bg-slate-100 p-3 rounded-lg"
							onChange={handleChange}
						/>
						<input
							type="email"
							placeholder="Email"
							id="email"
							required
							className="bg-slate-100 p-3 rounded-lg"
							onChange={handleChange}
						/>
						<input
							type="password"
							placeholder="Password"
							id="password"
							required
							className="bg-slate-100 p-3 rounded-lg"
							onChange={handleChange}
						/>
						<input
							type="password"
							placeholder="Confirm password"
							id="confirmPassword"
							required
							className="bg-slate-100 p-3 rounded-lg"
							onChange={handleChange}
						/>

						<button
							type="submit"
							className="p-3 bg-green-600 rounded-lg text-white font-bold uppercase hover:bg-green-500"
						>
							Sign up
						</button>

						{/* CheckBox*/ }
						<div  className="inline-flex items-center">
						<label className="flex items-center cursor-pointer relative" htmlFor="check-2">
							<input type="checkbox"
							checked
							className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
							id="check-2" />
							<span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
								stroke="currentColor" strokeWidth="1">
								<path fillRule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clipRule="evenodd"></path>
							</svg>
							</span>
						</label>
						<label className="cursor-pointer ml-2 text-slate-600 text-sm" htmlFor="check-2">
							<Link to="">
							<span className="text-blue-500">Terms and Condition</span>
							</Link>
						</label>

						</div>
						<div>
							<p>
								Already have an account?{" "}
								<Link to="/login">
									<span className="text-blue-500">Log in</span>
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
