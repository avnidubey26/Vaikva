import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const userName = localStorage.getItem("name");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/companies"
      );

      setCompanies(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const selectCompany = (company) => {
    navigate(`/company/${company.id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white">

      <nav className="flex justify-between items-center px-8 py-6 border-b border-white/10 backdrop-blur-md">

        <h1 className="text-3xl font-bold tracking-wide">
          CareerOS
        </h1>

        <div className="flex items-center gap-4">

          {userName ? (
            <>
              <p className="text-gray-300">
                Hi, {userName} 👋
              </p>

              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-xl border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-xl border border-white/20"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold"
              >
                Register
              </button>
            </>
          )}

        </div>

      </nav>

      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-black to-black"></div>

        <div className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl"></div>

        <div className="absolute right-20 top-20 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl"></div>

        <h1 className="text-7xl md:text-8xl font-extrabold mb-6 relative z-10">
          Crack Your
          <span className="text-blue-500"> Dream </span>
          Company
        </h1>

        <p className="text-gray-400 text-xl max-w-3xl mb-8 relative z-10">
          Master company-specific interview questions,
          placement roadmaps, aptitude preparation and
          hiring strategies.
        </p>

        <button className="relative z-10 bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition-all duration-300">
          Get Started
        </button>

        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-black"></div>

      </section>

      <section className="px-10 pb-20">

        <h2 className="text-4xl font-bold mb-6 text-center">
          Featured Companies
        </h2>

        <div className="max-w-xl mx-auto mb-10">
          <input
            type="text"
            placeholder="Search Company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {companies
            .filter((company) =>
              company.company_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((company) => (
              <div
                key={company.id}
                onClick={() => selectCompany(company)}
                className="cursor-pointer backdrop-blur-md rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] border border-white/10 bg-white/5 hover:border-blue-500"
              >
                <h3 className="text-2xl font-bold text-blue-400 mb-3">
                  {company.company_name}
                </h3>

                <p className="text-gray-300 mb-2">
                  Role: {company.role}
                </p>

                <p className="text-gray-300 mb-2">
                  Package: {company.package}
                </p>

                <p className="text-gray-300">
                  Experience: {company.experience}
                </p>
              </div>
            ))}

        </div>

      </section>

    </div>
  );
}

export default App;