import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="bg-gray-50 font-poppins">
      <Header />

      {/* About Section */}
      <section className="bg-white rounded-lg shadow-md p-8 w-full h-auto flex flex-col justify-center items-center">
        <div className="mb-8 text-left flex flex-col justify-center items-center">
          <h2 className="text-3xl font-semibold text-black mb-4 text-center">About Us</h2>
          <div className="flex flex-col items-center h-full text-center">
            <div className="w-full max-w-2xl pl-6 text-justify">
              <p className="text-black text-lg">
                Established in 2009, JC Kame Wood Furniture Shop has been a trusted name in crafting high-quality, custom wood furniture in Cavite, Boac, Marinduque, with over five decades of experience. We specialize in creating durable and elegant furniture that reflects the beauty of natural wood.
                Our commitment to craftsmanship and customer satisfaction has made us a go-to destination for homeowners and businesses alike.
                Whether you're looking for timeless classics or modern designs, JC Kame Wood Furniture Shop ensures every piece is made with care and precision to enhance the comfort and style of your space.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full max-w-lg flex justify-center border-2 border-solid border-green-300">
          <img src="/landingimage/LOGO.jpg" alt="JC Kame Logo" className="w-[200px] h-auto" />
        </div>
      </section>

      {/* Commitment Section */}
      <section className="bg-white p-8 mb-8 border-t-2 border-b-2 border-green-300 w-full h-auto mx-auto">
        <div className="mb-8 flex flex-col text-center">
          <h3 className="text-3xl md:text-2xl font-bold text-black mb-2">Our Commitment</h3>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-x-5 text-2xl text-black">
            <div className="flex-1 flex flex-col items-center">
              <img src="/landingimage/ads1.png" alt="Affordable" className="h-full m-2" />
              <p className="font-semibold">Affordable</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <img src="/landingimage/ads1.png" alt="Durable" className="h-full m-2" />
              <p className="font-semibold">Durable</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <img src="/landingimage/ads1.png" alt="Reliable" className="h-full m-2" />
              <p className="font-semibold">Reliable</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white rounded-lg shadow-md p-4 border-b-2 w-full h-auto max-w-8xl mx-auto space-y-8 text-justify">
        <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-x-8">
          {/* Left Side */}
          <div className="grid grid-cols-1 gap-8 w-full md:w-1/2">
            <div className="flex items-start">
              <img src="/landingimage/ads1.png" alt="Integrity" className="h-32 mr-4" /> 
              <div className="max-w-xs">
                <h4 className="font-bold text-bold text-2xl">Integrity</h4>
                <p className="text-black text-lg">
                  We operate with honesty and transparency in all aspects of our business practices.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <img src="/landingimage/ads1.png" alt="Quality" className="h-32 mr-4" /> 
              <div className="max-w-xs">
                <h4 className="font-bold text-bold text-2xl">Quality</h4>
                <p className="text-black text-lg">
                  We are dedicated to creating exceptional, well-crafted furniture that stands the test of time.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <img src="/landingimage/ads1.png" alt="Trust" className="h-32 mr-4" />
              <div className="max-w-xs">
                <h4 className="font-bold text-bold text-2xl">Trust</h4>
                <p className="text-black text-lg">
                  Trust is the foundation of our business. We strive to earn your trust with every piece we make.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="grid grid-cols-1 gap-8 w-full md:w-1/2">
            <div className="flex items-start">
              <div className="max-w-xs">
                <h4 className="font-bold text-bold text-2xl">Passion</h4>
                <p className="text-black text-lg">
                  We are passionate about turning raw materials into lasting furniture that enhances the beauty of your home.
                </p>
              </div>
              <img src="/landingimage/ads1.png" alt="Passion" className="h-32 ml-4" />
            </div>
            <div className="flex items-start">
              <div className="max-w-xs">
                <h4 className="font-bold text-bold text-2xl">Craftsmanship</h4>
                <p className="text-black text-lg">
                  Each piece is crafted with precision and care, combining traditional methods with modern design.
                </p>
              </div>
              <img src="/landingimage/ads1.png" alt="Craftsmanship" className="h-32 ml-4" />
            </div>
            <div className="flex items-start">
              <div className="max-w-xs">
                <h4 className="font-bold text-bold text-2xl">Security</h4>
                <p className="text-black text-lg">
                  We value the security of our transactions and ensure our customers feel safe doing business with us.
                </p>
              </div>
              <img src="/landingimage/ads1.png" alt="Security" className="h-32 ml-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Store Location */}
      <section className="bg-white rounded-lg shadow-md p-8 w-full h-auto flex flex-col justify-center items-center">
        <div className="mb-8 text-left flex flex-col justify-center items-center">
          <h2 className="text-3xl font-semibold text-black mb-4 text-center">Store Location</h2>
          <div className="flex flex-col items-center h-full text-center">
            <div className="w-full max-w-2xl pl-6 text-justify">
              <p className="text-black text-lg">
                Cawit-Tugos Barangay Rd, Boac, Marinduque
              </p>
              <p>Open: Mon-Sun 7:00 am - 4:30pm</p>
              <p>Phone No. 0945 270 3377</p>
            </div>
          </div>
        </div>
        <div className="w-full max-w-lg flex justify-center border-2 border-solid border-green-300">
          <img src="/landingimage/LOGO.jpg" alt="JC Kame Logo" className="w-[200px] h-auto" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
