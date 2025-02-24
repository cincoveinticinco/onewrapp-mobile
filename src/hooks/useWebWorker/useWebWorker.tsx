import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/Auth/Auth.context';
import environment from '../../../environment';
import useAppStore from '../../stores/useAppStore';
import { WorkerData, WorkerJobNameEnum, WorkerJobTypeEnum } from '../../Shared/types/workers.types';

interface UseWebWorkerProps {
  initialParams?: {
    groupBy: string | null;
    filterBy: string | null;
    filterIds: string;
    filterNames: string[];
    lang: string;
    projectId: string;
  };
}

const useWebWorker = ({ initialParams }: UseWebWorkerProps = {}) => {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [worker, setWorker] = useState<Worker | null>(null);
  const { getToken } = useAuth();
  const { 
    addReportToQeue,
  } = useAppStore()

  useEffect(() => {
    const newWorker = new Worker(new URL('./worker.ts', import.meta.url));
    
    newWorker.onmessage = (event) => {
      setResult(event.data);
      if (event.data.status === 'complete' || event.data.status === 'failed') {
        setLoading(false);
        
        const formattedWorkerData: WorkerData = {
          jobId: event.data.data.jid,
          jobName: WorkerJobNameEnum.BreakDownScene,
          jobType: WorkerJobTypeEnum.PDF,
          productionId: initialParams?.projectId || '',
          status: event.data.status,
          url: event.data.data.url
        }

        addReportToQeue(formattedWorkerData);
      }
    };

    newWorker.onerror = (error) => {
      setError(error);
      setLoading(false);
    };

    setWorker(newWorker);

    return () => {
      newWorker.terminate();
    };
  }, []);

  const startWorker = useCallback(async (params: any) => {
    if (!worker || !params) {
      setError(new Error('Worker or parameters not initialized'));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const baseUrl = environment.URL_PATH.replace('/ow_offline', '');
      const token = await getToken();
      if (!baseUrl || !token) {
        throw new Error('Missing required configuration');
      }

      worker.postMessage({
        ...params,
        token,
        baseUrl,
      });
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }, [worker, getToken]);

  return { result, error, loading, startWorker };
};

export default useWebWorker;
