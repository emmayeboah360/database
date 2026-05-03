import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ModuleId = bigint;
export type Timestamp = bigint;
export interface DashboardData {
    totalLessons: bigint;
    completionPercentage: bigint;
    completedLessons: bigint;
    nextLessonId?: LessonId;
    currentModuleId?: ModuleId;
}
export type LessonId = bigint;
export interface CourseOverview {
    title: string;
    totalLessons: bigint;
    description: string;
    totalModules: bigint;
    estimatedHours: bigint;
}
export type CertificateId = string;
export type UserId = Principal;
export interface ModuleWithLessons {
    totalCount: bigint;
    completedCount: bigint;
    lessons: Array<LessonWithStatus>;
    module: Module;
}
export interface Lesson {
    id: LessonId;
    moduleId: ModuleId;
    title: string;
    content: string;
    order: bigint;
    isHL: boolean;
    difficulty: Difficulty;
    description: string;
    durationMinutes: bigint;
}
export interface LessonWithStatus {
    completedAt?: Timestamp;
    completed: boolean;
    lesson: Lesson;
}
export interface Module {
    id: ModuleId;
    title: string;
    order: bigint;
    description: string;
}
export interface UserProfile {
    userId: UserId;
    overallProgressPercentage: bigint;
    isEnrolled: boolean;
    certificates: Array<Certificate>;
}
export interface Certificate {
    id: CertificateId;
    completedAt: Timestamp;
    userId: UserId;
    level: CertificateLevel;
    learnerName: string;
    issuedAt: Timestamp;
    courseTitle: string;
}
export enum CertificateLevel {
    HigherLevel = "HigherLevel",
    StandardLevel = "StandardLevel"
}
export enum Difficulty {
    Beginner = "Beginner",
    Advanced = "Advanced",
    Intermediate = "Intermediate"
}
export interface backendInterface {
    completeLesson(lessonId: LessonId, learnerName: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    } | {
        __kind__: "certificateIssued";
        certificateIssued: Certificate;
    }>;
    enrollInCourse(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getCertificate(): Promise<Certificate | null>;
    getCourseOverview(): Promise<CourseOverview>;
    getDashboard(): Promise<DashboardData | null>;
    getModulesWithStatus(): Promise<Array<ModuleWithLessons>>;
    getProgressHistory(): Promise<Array<LessonWithStatus>>;
    getUserProfile(): Promise<UserProfile>;
}
