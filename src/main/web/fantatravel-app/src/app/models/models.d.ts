/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.32.889 on 2025-08-17 08:11:13.

export interface CategoryModel {
    id: number;
    description: string;
}

export interface DestinationModel {
    id: number;
    name: string;
    description: string;
}

export interface AddPointRequest {
    travelId: number;
    day: Date;
    rules: AddPointRuleUsersRequest[];
}

export interface AddPointRequestBuilder {
}

export interface AddPointRuleUsersRequest {
    rule: RuleModel;
    users: TravelUserModel[];
}

export interface AddPointRuleUsersRequestBuilder {
}

export interface NotSelectableTravelersModel {
    rule: RuleModel;
    users: TravelUserModel[];
}

export interface PointsDayModel {
    day: Date;
    users: PointsUserModel[];
}

export interface PointsUserModel {
    position: number;
    user: TravelUserModel;
    points: number;
}

export interface RuleModel {
    id: number;
    travelRuleId: number;
    description: string;
    repeatable: boolean;
    value: number;
    category: CategoryModel;
    destinations: DestinationModel[];
    selected: boolean;
}

export interface AuthenticationRequest {
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    token: string;
}

export interface AuthenticationResponse {
    token: string;
    refreshToken: string;
}

export interface UserInfoModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface SpecialCategoryModel {
    id: number;
    travelSpecialCategoryId: number;
    name: string;
    description: string;
    selected: boolean;
    traveler: TravelUserModel;
}

export interface CreateTeamRequest {
    travelId: number;
    name: string;
    users: CreateTeamUserRequest[];
    specialCategories: AssignSpecialCategoryRequest[];
}

export interface CreateTeamUserRequest {
    user: UserInfoModel;
    captain: boolean;
}

export interface TeamModel {
    id: number;
    name: string;
    teamUsers: TeamUserModel[];
    teamSpecialCategories: TeamSpecialCategoryModel[];
    admin: boolean;
}

export interface TeamSpecialCategoryModel {
    id: number;
    specialCategory: SpecialCategoryModel;
    travelUser: TravelUserModel;
}

export interface TeamUserModel {
    id: number;
    firstName: string;
    lastName: string;
    captain: boolean;
}

export interface AssignSpecialCategoryRequest {
    user: UserInfoModel;
    specialCategory: SpecialCategoryModel;
}

export interface CreateTravelRequest {
    name: string;
    destination: DestinationModel;
    startDate: Date;
    endDate: Date;
}

export interface LinkRuleTravelRequest {
    rules: RuleModel[];
}

export interface LinkSpecialCategoryTravelRequest {
    specialCategories: SpecialCategoryModel[];
}

export interface ReviewedTravelRequest {
    assignSpecialCategories: AssignSpecialCategoryRequest[];
    comment: string;
}

export interface TravelModel {
    id: number;
    name: string;
    destination: DestinationModel;
    startDate: string;
    endDate: string;
    admin: boolean;
    travelers: TravelUserModel[];
    players: TravelUserModel[];
    rules: RuleModel[];
    specialCategories: SpecialCategoryModel[];
    editable: boolean;
    reviewed: boolean;
    reviewedComment: string;
}

export interface TravelUserModel {
    id: number;
    firstName: string;
    lastName: string;
    team: TeamModel;
    me: boolean;
}

export interface ResetPasswordRequest {
    password: string;
    passwordRepeat: string;
    token: string;
}

export interface UserConfirmationRequest {
    confirmationCode: string;
}

export interface UserRegistrationRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordRepeat: string;
}

export interface UserUpdateRequest {
    firstName: string;
    lastName: string;
}

export interface BuildInfoModel {
    version: string;
}
