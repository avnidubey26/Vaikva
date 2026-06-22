import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);

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

  const selectCompany = async (company) => {
    setSelectedCompany(company);

    try {
      const questionsResponse = await axios.get(
        `http://127.0.0.1:8000/companies/${company.id}/questions`
      );

      const roadmapsResponse = await axios.get(
        `http://127.0.0.1:8000/companies/${company.id}/roadmaps`
      );

      setQuestions(questionsResponse.data);
      setRoadmaps(roadmapsResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      <nav className="flex justify-between items-center px-8 py-6 border-b border-white/10 backdrop-blur-md">
        <h1 className="text-3xl font-bold tracking-wide">
          CareerOS
        </h1>

        <div className="flex gap-4">
          <button className="px-5 py-2 rounded-xl border border-white/20">
            Login
          </button>

          <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold">
            Register
          </button>
        </div>
      </nav>

      <section className="relative flex flex-col items-center justify-center text-center h-[80vh] px-6 overflow-hidden">

        <div className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl"></div>

        <div className="absolute right-20 top-20 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl"></div>

        <h1 className="text-7xl md:text-8xl font-extrabold mb-6 relative z-10">
          Crack Your
          <span className="text-blue-500"> Dream </span>
          Company
        </h1>

        <p className="text-gray-400 text-xl max-w-3xl mb-8 relative z-10">
          Master company-specific interview questions, placement roadmaps,
          aptitude preparation and hiring strategies.
        </p>

        <button className="relative z-10 bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-xl text-lg font-semibold">
          Get Started
        </button>
      </section>

      <section className="px-10 pb-20">

        <h2 className="text-4xl font-bold mb-10 text-center">
          Featured Companies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => selectCompany(company)}
              className="cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-blue-500 hover:scale-[1.02] transition-all duration-300"
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

      {selectedCompany && (
        <section className="px-10 pb-20">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">

            <h2 className="text-4xl font-bold text-blue-400 mb-6">
              {selectedCompany.company_name}
            </h2>

            <div className="mb-10">
              <h3 className="text-2xl font-semibold mb-4">
                Interview Questions
              </h3>

              {questions.map((question) => (
                <div
                  key={question.id}
                  className="bg-black/30 rounded-xl p-4 mb-4"
                >
                  <p className="font-semibold">
                    {question.question}
                  </p>

                  <p className="text-gray-400 mt-2">
                    {question.answer}
                  </p>

                  <p className="text-blue-400 mt-2">
                    {question.difficulty}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Roadmaps
              </h3>

              {roadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className="bg-black/30 rounded-xl p-4 mb-4"
                >
                  <p className="font-semibold">
                    {roadmap.title}
                  </p>

                  <p className="text-gray-400 mt-2">
                    {roadmap.description}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </section>
      )}

    </div>
  );
}

export default App;
