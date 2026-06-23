import { useEffect, useState } from "react";
import {
  useParams,
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";

function CompanyDetails() {
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const questionsResponse = await axios.get(
        `http://127.0.0.1:8000/companies/${id}/questions`
      );

      const roadmapsResponse = await axios.get(
        `http://127.0.0.1:8000/companies/${id}/roadmaps`
      );

      setQuestions(questionsResponse.data);
      setRoadmaps(roadmapsResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <Link
        to="/"
        className="inline-block mb-8 px-4 py-2 border border-white/20 rounded-lg hover:border-blue-500"
      >
        ← Back
      </Link>

      <h1 className="text-5xl font-bold mb-10">
        Company Preparation
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-3xl font-bold text-blue-400 mb-6">
            Interview Questions
          </h2>

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

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-3xl font-bold text-purple-400 mb-6">
            Roadmaps
          </h2>

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

    </div>
  );
}

export default CompanyDetails;