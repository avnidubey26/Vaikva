import { useEffect, useState } from "react";
import axios from "axios";

function SavedCompanies() {
  const [savedCompanies, setSavedCompanies] = useState([]);

  useEffect(() => {
    fetchSavedCompanies();
  }, []);

  const fetchSavedCompanies = async () => {
    try {
      const userId = localStorage.getItem("user_id");

      const response = await axios.get(
        `http://127.0.0.1:8000/saved-companies/${userId}`
      );

      setSavedCompanies(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-10">
        Saved Companies
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedCompanies.map((company) => (
          <div
            key={company.id}
            className="p-6 rounded-2xl border border-white/10 bg-white/5"
          >
            <h2 className="text-xl font-bold text-blue-400">
              Saved Company ID: {company.company_id}
            </h2>

            <p className="mt-2 text-gray-300">
              Save ID: {company.id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedCompanies;