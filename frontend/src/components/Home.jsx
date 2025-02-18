import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(()=>{
      const token = localStorage.getItem("user")
      // if(token){
      //   setIsLoggedIn(true)

      // }else{
      //   isLoggedIn(false)
      // }
  },[])


  const handleLogout =async()=>{
         try{
          const response =  axios.get('http://localhost:3000/api/v1/user/logout')
          toast.success((await response).data.message)
          setIsLoggedIn(false)
         }catch(error){
               console.log("Error in logout",error)
               toast.error(error.response.data.errors || "Erros in logged out!")
         }
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/course/courses"
        );
        setCourses(response.data.courses);
      } catch (error) {
        console.log("Error in fetchCourse", error);
      }
    };
    fetchCourses();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
      <div className="min-h-screen text-white px-4 md:px-12">
        <header className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/logo.webp"
              alt=""
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            />
            <h1 className="text-lg sm:text-2xl text-orange-500 font-bold">
              CourseHeaven
            </h1>
          </div>
          <div className="space-x-2 sm:space-x-4">
           {isLoggedIn ? (
            <button onClick={handleLogout} className="bg-green-500 cursor-pointer text-white py-1 sm:py-2 px-3 sm:px-4 border border-white rounded">
              Logout
            </button>
           ):(
            <>
             <Link
              to={"/login"}
              className="bg-green-500 text-white py-1 sm:py-2 px-3 sm:px-4 border border-white rounded"
            >
              Login
            </Link>
            <Link
              to={"/signup"}
              className="bg-green-500 text-white py-1 sm:py-2 px-3 sm:px-4 border border-white rounded"
            >
              Signup
            </Link>
            </>
           )}
          </div>
        </header>

        <section className="text-center py-10 sm:py-20">
          <h1 className="text-2xl sm:text-4xl font-bold text-orange-500 mb-3 sm:mb-5">
            CourseHeaven
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Sharpen your skills with courses crafted by experts.
          </p>
          <div className="mt-5">
            <Link to={"/courses"} className="bg-green-500 text-white rounded mt-4 cursor-pointer duration-300 font-semibold hover:bg-white hover:text-black py-2 px-4">
              Explore Courses
            </Link>
          </div>
        </section>

        <section className="slider-container">
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-4">
                <div
                  className="relative flex-shrink-0 w-full sm:w-92 transition-transform"
                >
                  <div className="rounded-lg overflow-hidden ">
                    <img
                      src={course.image.url}
                      alt=""
                      className="h-32 w-full object-contain"
                    />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-white">
                        {course.title}
                      </h2>
                      <Link to="/courses" className="mt-4 bg-yellow-600 py-4 px-6 rounded-lg text-lg font-bold duration-300 cursor-pointer hover:bg-blue-500">
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        < hr className="text-red-600" />

        <footer className="my-12 sm:my-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center cursor-pointer space-x-2">
                <img
                  src="/logo.webp"
                  alt=""
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                />
                <h1 className="text-lg sm:text-2xl text-orange-500 font-bold">
                  CourseHeaven
                </h1>
              </div>
              <div className="mt-3 text-center md:text-left">
                <p className="mb-2 text-black">Follow us</p>
                <div className="flex justify-center md:justify-start space-x-4">
                  <a href="">
                    <FaFacebook className=" text-blue-600 text-xl sm:text-2xl " />
                  </a>
                  <a href="">
                    <FaInstagram className=" text-pink-600 text-xl sm:text-2xl " />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                Connects
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li className="hover:text-white cursor-pointer duration-300">
                  Facebook : Bishal Course
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Telegram : Bishal Course
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Github : Bishal Course
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
                Copyrights &#169; 2025
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;

