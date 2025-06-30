import React, { useState, useEffect } from 'react';

const JobListing = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:50001/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  return (
    <div>
      <h2>Available Jobs</h2>
      {jobs.map((job) => (
        <div key={job.id}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <button>Apply</button>
        </div>
      ))}
    </div>
  );
};

export default JobListing;
