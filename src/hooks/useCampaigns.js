import { useState, useEffect } from 'react';
import { getCampaigns } from '../api/campaigns';

export const useCampaigns = (filters) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCampaigns(filters)
      .then(data => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { campaigns, loading, error, setCampaigns };
};
