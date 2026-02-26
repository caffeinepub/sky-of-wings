import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type Username = string;
export interface LoginEntry {
    username: Username;
    timestamp: Timestamp;
}
export interface backendInterface {
    getAllLogins(): Promise<Array<LoginEntry>>;
    recordLogin(username: Username): Promise<void>;
}
