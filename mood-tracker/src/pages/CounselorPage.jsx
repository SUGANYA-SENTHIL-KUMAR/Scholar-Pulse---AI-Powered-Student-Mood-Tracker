// src/pages/CounselorPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import counselors from "../data/counselors";
import CounselorCard from "../components/CounselorCard";
import Nav from "../components/Nav";

function CounselorPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");

  const filteredCounselors = counselors.filter((c) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      query === "" ||
      c.name.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query) ||
      c.specialization.toLowerCase().includes(query);

    const matchesGender = genderFilter === "All" || c.gender === genderFilter;

    return matchesSearch && matchesGender;
  });

  return (
    <><Nav/><div className="container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h2 className="counselor-page-title">Find a Counselor</h2>

      <div className="counselor-controls">
        <input
          type="text"
          className="counselor-search"
          placeholder="Search by name, city, or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="counselor-filter"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="counselor-list">
        {filteredCounselors.length === 0 ? (
          <p className="no-results">No counselors match your search.</p>
        ) : (
          filteredCounselors.map((c) => <CounselorCard key={c.id} counselor={c} />)
        )}
      </div>
    </div></>
  );
}

export default CounselorPage;
