    import React from 'react';
    import './App.css';
    import {Navigate, Route, Routes} from "react-router-dom";
    import PrivateRoute from "./PrivateRoute";
    import Login from "./app/component/login/Login";
    import Home from "./app/component/home/Home";
    import BaseLayout from "./app/component/base-layout/BaseLayout";
    import Teams from "./app/component/teams/Teams";
    import Profile from "./app/component/profile/Profile";
    import Travels from "./app/component/travels/Travels";
    import TravelCreate from "./app/component/travels/create/TravelCreate";
    import TravelManage from "./app/component/travels/manage/TravelManage";
    import TravelManageRules from "./app/component/travels/manage/rules/TravelManageRules";
    import UserRegistration from "./app/component/user-registration/UserRegistration";
    import UserConfirmation from "./app/component/user-confirmation/UserConfirmation";
    import ManageTeam from "./app/component/teams/manage-team/ManageTeam";
    import AddPoint from "./app/component/points/add-point/AddPoint";
    import Points from "./app/component/points/Points";
    import {useTranslation} from "react-i18next";
    import ResetPasswordRequest from "./app/component/reset-password/ResetPasswordRequest";
    import ResetPassword from "./app/component/reset-password/ResetPassword";
    import TravelManageSpecialCategories
        from "./app/component/travels/manage/special-category/TravelManageSpecialCategories";
    import ReviewTravel from "./app/component/review-travel/ReviewTravel";
    import AlreadyHaveCodeConfirmation
        from "./app/component/already-have-code-confirmation/AlreadyHaveCodeConfirmation";

    function App() {
        const {t} = useTranslation("translation", {keyPrefix: "pages"});
        return (
            <Routes>
                <Route path="/" element={<Navigate to="/home"/>}/>

                <Route path="/login" element={<BaseLayout notLoggedPage={true}> <Login/> </BaseLayout>}/>

                <Route path="/user-registration" element={
                    <BaseLayout notLoggedPage={true}><UserRegistration/> </BaseLayout>}/>
                <Route path="/reset-password-request" element={
                    <BaseLayout notLoggedPage={true}><ResetPasswordRequest/> </BaseLayout>}/>
                <Route path="/confirm-reset-password/:token" element={
                    <BaseLayout notLoggedPage={true}><ResetPassword/> </BaseLayout>}/>

                <Route path="/user-confirmation/:id" element={
                    <BaseLayout notLoggedPage={true}><UserConfirmation/> </BaseLayout>}/>

                <Route path="/already-have-code-confirmation" element={
                    <BaseLayout notLoggedPage={true}><AlreadyHaveCodeConfirmation/> </BaseLayout>}/>

                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <BaseLayout>
                                <Home/>
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/travels"
                    element={
                        <PrivateRoute>
                            <BaseLayout title={t('travels')}>
                                <Travels/>
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/travels/create"
                    element={
                        <PrivateRoute>
                            <BaseLayout title={t('create_travel')} back={{path: '/travels', label: t('travels')}}>
                                <TravelCreate />
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/travels/:id"
                    element={
                        <PrivateRoute>
                            <BaseLayout title={t('travel_details')} back={{path: '/travels', label: t('travels')}}>
                                <TravelManage/>
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/travels/:id/rules"
                    element={
                        <PrivateRoute>
                            <BaseLayout title={t('rules')} back={{path: '/travels/:id', label: t('travel_details')}}>
                                <TravelManageRules/>
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/travels/:id/special-categories"
                    element={
                        <PrivateRoute>
                            <BaseLayout title={t('special_categories')} back={{path: '/travels/:id', label: t('travel_details')}}>
                                <TravelManageSpecialCategories/>
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/travels/:id/link-traveler"
                    element={
                        <PrivateRoute>
                            <BaseLayout>
                                <TravelManage linkUser={true} role={'TRAVELER'}/>
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/travels/:id/link-player"
                    element={
                        <PrivateRoute>
                            <BaseLayout>
                                <TravelManage linkUser={true} role={'PLAYER'}/>
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/teams"
                    element={
                        <PrivateRoute>
                            <BaseLayout title={t('your_teams')}>
                                <Teams/>
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/teams/:id"
                    element={
                        <PrivateRoute>
                            <BaseLayout title={t('travel_details')} back={{path: '/teams', label: t('teams')}}>
                                <TravelManage/>
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/travel/:travelId/team/:id?"
                    element={
                        <PrivateRoute>
                            <BaseLayout title={t("manage_team")} back={{path: '/teams', label: t('teams')}}>
                                <ManageTeam/>
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/travel/:id/review"
                    element={
                        <PrivateRoute>
                            <BaseLayout title={t("review_travel")} back={{path: '/travels/:id', label: t('travel_details')}}>
                                <ReviewTravel/>
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/travel/:id/points/:day"
                    element={
                        <PrivateRoute>
                            <BaseLayout title={t('point_details')} back={{path: '/travel/:id/points', label: t('points')}}>
                                <AddPoint/>
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/travel/:id/points"
                    element={
                        <PrivateRoute>
                            <BaseLayout title={t('points')} back={{path: '/travels/:id', label: t('travel_details')}}>
                                <Points/>
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <BaseLayout title={t('profile')}>
                                <Profile/>
                            </BaseLayout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        );
    }

    export default App;
