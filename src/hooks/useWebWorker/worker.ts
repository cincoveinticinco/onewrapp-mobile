interface WorkerParams {
  groupBy: string;
  filterBy: string;
  filterIds: string;
  lang: string;
  projectId: string;
  token: string;
  baseUrl: string;
  filterNames: string[];
}

self.onmessage = async (e: MessageEvent<WorkerParams>) => {
  const { groupBy, filterBy, filterIds, lang, projectId, token, baseUrl, filterNames } = e.data;
  
  try {
    if (!baseUrl || typeof baseUrl !== 'string') {
      throw new Error('Invalid baseUrl provided');
    }
 
    const sanitizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    
    const route = 'workers/breakdown_pdf';
    const fullUrl = new URL(route, sanitizedBaseUrl);

    const params = new URLSearchParams({
      group_by: groupBy,
      filter_by: filterBy,
      filter_ids: filterIds || '',
      lang: lang || 'eng',
      project_id: projectId || '',
      filter_names: filterNames?.join(',')
    });
    
    const initialResponse = await fetch(`${fullUrl.toString()}?${params.toString()}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        owsession: token,
      },
    });

    if (!initialResponse.ok) {
      throw new Error(`HTTP error! status: ${initialResponse.status}`);
    }

    const initialData = await initialResponse.json();
    if (!initialData.job_id) {
      throw new Error('No job ID received from server');
    }

    const jobId = initialData.job_id;

    // Poll for progress
    while (true) {
      const progressUrl = new URL('workers/get_progress', sanitizedBaseUrl);
      
      const progressResponse = await fetch(progressUrl.toString(), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          owsession: token,
        },
        body: JSON.stringify({ job_id: jobId }),
      });

      if (!progressResponse.ok) {
        throw new Error(`Progress check failed! status: ${progressResponse.status}`);
      }

      const progressData = await progressResponse.json();
      self.postMessage(progressData);

      if (progressData.status === 'complete' || progressData.status === 'failed') {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error: any) {
    console.error('Worker error:', error);
    self.postMessage({ 
      status: 'failed', 
      error: error.message || 'Export process failed'
    });
  }
};
