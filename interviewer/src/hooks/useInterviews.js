const useInterviews = () => {
  const getAllInterviews = async () => {
    let interviews = [];
    try {
      const response = await fetch('/api/interviews', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to get interviews');
      }
      interviews = await response.json();
    } catch (err) {
      console.error('getAllInterviews error:', err);
    }
    return interviews;
  };

  const getInterview = async (interviewId) => {
    let interview = {};
    try {
      const response = await fetch('/api/interviews/' + interviewId, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to get interviews');
      }
      interview = await response.json();
    } catch (err) {
      console.error('getInterview error:', err);
    }
    return interview;
  };

  const evaluateInterview = async (interviewId) => {
    let interview = {};
    try {
      const response = await fetch('/api/interviews/evaluate/' + interviewId, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to evaluate interviews');
      }
      interview = await response.json();
    } catch (err) {
      console.error('evaluateInterview error:', err);
    }
    return interview;
  };

  return { getAllInterviews, getInterview, evaluateInterview };
};

export default useInterviews;
