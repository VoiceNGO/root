export default function copy(src: string, dest: string, { recursive }?: {
    recursive?: boolean;
}): Promise<void>;
