import {
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import {
  business,
  calendar,
  listSharp,
  people,
  reader, settings,
} from 'ionicons/icons';
import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import {
  Redirect, Route,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import DatabaseContext from '../../../context/Database.context';
import AppLoader from '../../../hooks/Shared/AppLoader';
import { SecurePages } from '../../../interfaces/securePages.types';
import { User } from '../../../interfaces/user.types';
import AddScene from '../../../pages/AddScene/AddScene';
import Calendar from '../../../pages/Calendar/Calendar';
import CallSheet from '../../../pages/CallSheet/CallSheet';
import Cast from '../../../pages/Cast/Cast';
import Crew from '../../../pages/Crew/Crew';
import EditScene from '../../../pages/EditScene/EditScene';
import EditSceneToDetails from '../../../pages/EditScene/EditSceneToDetails';
import Elements from '../../../pages/Elements/Elements';
import FilterScenes from '../../../pages/FilterScenes/FilterScenes';
import ReplicationPage from '../../../pages/ReplicationPage/ReplicationPage';
import Reports from '../../../pages/Reports/Reports';
import SceneDetails from '../../../pages/SceneDetails/SceneDetails';
import SceneScript from '../../../pages/SceneScript/SceneScript';
import Sets from '../../../pages/Sets/Sets';
import Settings from '../../../pages/Settings/Settings';
import ShootingDetail from '../../../pages/ShootingDetail/ShootingDetail';
import StripBoard from '../../../pages/StripBoard/StripBoard';
import Strips from '../../../pages/Strips/Strips';
import ProtectedRoute from '../../ProtectedRoute/ProtectedRoute';
import './AppTabs.scss';

setupIonicReact();

const AppTabs: React.FC = () => {
  const { viewTabs, oneWrapDb, projectId } = useContext(DatabaseContext);
  const [user, setUser] = useState<User | null>(null);
  const [currentCompany, setCurrentCompany] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    const userInstance = await oneWrapDb?.user.findOne().exec();
    setUser(userInstance._data);
  };

  const fetchCurrentProject = async () => {
    const projects = await oneWrapDb?.projects.find().exec();
    const cProject = projects?.find((project: any) => project._data.id == projectId);
    setCurrentCompany(cProject.companyId);
  };

  const getSecurePageAccess = useCallback((pageId: number) => {
    if (currentCompany && user) {
      const company = user.companies.find((company: any) => company.id == currentCompany);
      if(company?.userTypeId === 1) {
        const page = company?.securePages.find((page: any) => page.id == pageId);
        return page?.access;
      } else if (company?.userTypeId === 2) {
        const project = company?.projects?.find((project: any) => project.id == projectId);
        const page = project?.securePages.find((page: any) => page.id == pageId);
        return page?.access;
      }
    }
    return null;
  }, [currentCompany, user]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchUser();
      await fetchCurrentProject();
      setIsLoading(false);
    };
    loadData();
  }, [oneWrapDb]);

  const urlString = '/my/projects/:id' as any;
  const { url } = useRouteMatch();
  const unauthorizedRoute = `/my/projects/${projectId}/unauthorized`;

  const defineButtonClassAccess = (pageId: number, notInMobile: boolean = false) => {
    const access = getSecurePageAccess(pageId);
    if (access === null || access === undefined) {
      return 'tab-bar-buttons disabled';
    } if (notInMobile) {
      return notInMobile ? 'tab-bar-buttons disabled' : 'tab-bar-buttons';
    }
    return 'tab-bar-buttons';
  };

  if (isLoading) {
    return (
      <IonPage>
        <IonContent>
          {AppLoader()}
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonTabs className="ion-tabs">
      <IonRouterOutlet mode="md">
        <Route exact path={`${urlString}/replication`}>
          <ReplicationPage />
        </Route>

        <ProtectedRoute
          exact
          path={`${urlString}/addscene`}
          permissionType={getSecurePageAccess(SecurePages.SCENES)}
          component={AddScene}
          unauthorizedRoute={unauthorizedRoute}
        />
        <ProtectedRoute
          exact
          path={`${urlString}/calendar`}
          permissionType={getSecurePageAccess(SecurePages.CALENDAR)}
          component={Calendar}
          unauthorizedRoute={unauthorizedRoute}
        />
        <ProtectedRoute
          exact
          path={`${urlString}/cast`}
          permissionType={getSecurePageAccess(SecurePages.CAST)}
          component={Cast}
          unauthorizedRoute={unauthorizedRoute}
        />
        <ProtectedRoute
          exact
          path={`${urlString}/crew`}
          permissionType={getSecurePageAccess(SecurePages.CREW)}
          component={Crew}
          unauthorizedRoute={unauthorizedRoute}
        />
        <ProtectedRoute
          exact
          path={`${urlString}/sets`}
          permissionType={getSecurePageAccess(SecurePages.SETS)}
          component={Sets}
          unauthorizedRoute={unauthorizedRoute}
        />
        <ProtectedRoute
          exact
          path={`${urlString}/elements`}
          permissionType={getSecurePageAccess(SecurePages.ELEMENTS)}
          component={Elements}
          unauthorizedRoute={unauthorizedRoute}
        />
        <ProtectedRoute
          exact
          path={`${urlString}/strips`}
          permissionType={getSecurePageAccess(SecurePages.SCENES)}
          component={Strips}
          unauthorizedRoute={unauthorizedRoute}
        />

        <ProtectedRoute
          exact
          path={`${urlString}/editscene/:sceneId`}
          component={EditScene}
          permissionType={getSecurePageAccess(SecurePages.SCENES)}
          unauthorizedRoute={unauthorizedRoute}
        />
        <ProtectedRoute
          exact
          path={`${urlString}/editscene/:sceneId/details`}
          component={EditSceneToDetails}
          permissionType={getSecurePageAccess(SecurePages.SCENES)}
          unauthorizedRoute={unauthorizedRoute}
        />

        <ProtectedRoute
          exact
          path={`${urlString}/shooting/:shootingId`}
          component={ShootingDetail}
          permissionType={getSecurePageAccess(SecurePages.SHOOTING_DETAIL)}
          unauthorizedRoute={unauthorizedRoute}
        />

        <ProtectedRoute
          exact
          path={`${urlString}/shooting/:shootingId/callsheet`}
          component={CallSheet}
          permissionType={getSecurePageAccess(SecurePages.SHOOTING_DETAIL)}
          unauthorizedRoute={unauthorizedRoute}
        />

        <ProtectedRoute
          exact
          path={`${urlString}/strips/details/scene/:sceneId`}
          component={SceneDetails}
          permissionType={getSecurePageAccess(SecurePages.SHOOTING_DETAIL)}
          unauthorizedRoute={unauthorizedRoute}
        />

        <ProtectedRoute
          exact
          path={`${urlString}/shooting/:shootingId/details/scene/:sceneId`}
          component={SceneDetails}
          permissionType={getSecurePageAccess(SecurePages.SHOOTING_DETAIL)}
          unauthorizedRoute={unauthorizedRoute}
          additionalProps={{ isShooting: true }}
        />

        <ProtectedRoute
          exact
          path={`${urlString}/shooting/:shootingId/details/script/:sceneId`}
          component={SceneScript}
          permissionType={getSecurePageAccess(SecurePages.SHOOTING_DETAIL)}
          unauthorizedRoute={unauthorizedRoute}
          additionalProps={{ isShooting: true }}
        />

        <ProtectedRoute
          exact
          path={`${urlString}/strips/details/script/:sceneId`}
          component={SceneScript}
          permissionType={getSecurePageAccess(SecurePages.SCENES)}
          unauthorizedRoute={unauthorizedRoute}
        />

        <ProtectedRoute
          exact
          path={`${urlString}/strips/filters`}
          permissionType={1}
          component={FilterScenes}
          unauthorizedRoute={unauthorizedRoute}
        />

        <Route exact path={`${urlString}/stripboard`}>
          <StripBoard />
        </Route>
        <Route exact path={`${urlString}/reports`}>
          <Reports />
        </Route>
        <Route exact path={`${urlString}/settings`}>
          <Settings />
        </Route>
        <Redirect exact from={`${urlString}`} to={`${urlString}/strips`} />
      </IonRouterOutlet>

      <IonTabBar
        slot="bottom"
        className="app-tabs-container"
        color="dark"
        style={{ display: viewTabs ? '' : 'none' }}
      >
        <IonTabButton tab="calendar" className={defineButtonClassAccess(SecurePages.CALENDAR)} href={`${url}/calendar`}>
          <IonIcon icon={calendar} className="tab-bar-icons" />
          <IonLabel>CALENDAR</IonLabel>
        </IonTabButton>
        <IonTabButton tab="strips" className={defineButtonClassAccess(SecurePages.SCENES)} href={`${url}/strips`}>
          <IonIcon icon={listSharp} className="tab-bar-icons" />
          <IonLabel>SCENES</IonLabel>
        </IonTabButton>
        {/* <IonTabButton tab="stripboard" className="tab-bar-buttons" href={`${url}/stripboard`}>
          <IonIcon icon={calendar} className="tab-bar-icons" />
          <IonLabel>STRIPBOARD</IonLabel>
        </IonTabButton> */}
        <IonTabButton tab="cast" className={defineButtonClassAccess(SecurePages.CAST)} href={`${url}/cast`}>
          <IonIcon icon={people} className="tab-bar-icons" />
          <IonLabel>CAST</IonLabel>
        </IonTabButton>
        <IonTabButton tab="crew" className={defineButtonClassAccess(SecurePages.CREW)} href={`${url}/crew`}>
          <IonIcon icon={people} className="tab-bar-icons" />
          <IonLabel>CREW</IonLabel>
        </IonTabButton>
        <IonTabButton tab="sets" className={defineButtonClassAccess(SecurePages.SETS)} href={`${url}/sets`}>
          <IonIcon icon={business} className="tab-bar-icons" />
          <IonLabel>SETS</IonLabel>
        </IonTabButton>
        <IonTabButton tab="elements" className={defineButtonClassAccess(SecurePages.ELEMENTS)} href={`${url}/elements`}>
          <IonIcon icon={business} className="tab-bar-icons" />
          <IonLabel>ELEMENTS</IonLabel>
        </IonTabButton>
        {/* <IonTabButton tab="reports" className="tab-bar-buttons" href={`${url}/reports`}>
          <IonIcon icon={reader} className="tab-bar-icons" />
          <IonLabel>REPORTS</IonLabel>
        </IonTabButton> */}
        <IonTabButton tab="settings" className="tab-bar-buttons" href={`${url}/settings`}>
          <IonIcon icon={settings} className="tab-bar-icons" />
          <IonLabel>SETTINGS</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppTabs;
