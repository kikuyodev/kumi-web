// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventCallback = (...args: any[]) => void;
type SongEvents = "load" | "play" | "stop" | "pause" | "progress";

export class GlobalAudio {
    /**
     * Global volume for all music and sound effects.
     */
    public volume: number = 1;

    /**
     * Whether or not music is currently playing.
     */
    public playing: boolean = false;

    /**
     * The current song that is playing.
     */
    public currentSong?: Song;

    public async play(song: string, transition: number = 0) {
        if (this.playing) {
            await this.stop(transition);
        }

        if (song === "none") {
            return;
        }

        this.currentSong?.destroy();
        this.currentSong = new Song(song, song, this);
        await this.currentSong.load();

        this.playing = true;
        this.currentSong.play();

        return this.currentSong;
    }

    public async stop(transition: number = 0) {
        this.playing = false;
        this.currentSong?.stop(transition);

        await new Promise(resolve => setTimeout(resolve, transition * 1000));
    }

    public async pause() {
        this.playing = false;
        this.currentSong?.pause();
    }
}

export class Song {
    /**
     * The name of the song.
     */
    public name: string;

    /**
     * The path to the song file.
     */
    public path: string;

    /**
     * Whether or not the song has been loaded.
     */
    public loaded: boolean = false;

    /**
     * The progress of the song when playing.
     */
    public progress: number = 0;

    private pausedAt: number = 0;
    
    private globalAudio: GlobalAudio;
    private audioContext!: AudioContext;
    private audioBuffer!: AudioBuffer;
    private source!: AudioBufferSourceNode;
    private gain!: GainNode;
    private interval!: NodeJS.Timeout;

    private events: Map<SongEvents, EventCallback[]> = new Map();

    constructor(name: string, path: string, globalAudio: GlobalAudio) {
        this.name = name;
        this.path = path;
        this.globalAudio = globalAudio;

        if (!Song.isUrl(path)) {
            this.path = `./assets/music/${path}`;
        }
    }

    public async load() {
        const res = await fetch(this.path);
        const bytes = await res.arrayBuffer();

        this.audioContext = new AudioContext();
        this.audioBuffer = await this.audioContext.decodeAudioData(bytes);

        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.audioBuffer;

        this.gain = this.audioContext.createGain();
        this.source.connect(this.gain);
        this.gain.connect(this.audioContext.destination);
        this.gain.gain.value = this.globalAudio.volume;

        this.loaded = true;
        this.emit("load");
    }

    public play() {
        if (this.pausedAt !== 0) {
            this.audioContext.resume();
        } else {
            this.source.start(undefined, this.pausedAt);
        }

        this.emit("play");

        this.interval = setInterval(() => {
            this.progress = this.source.context.currentTime / this.audioBuffer.duration;
            this.emit("progress", this.progress);

            if (this.progress >= 1) {
                clearInterval(this.interval);
                this.stop();
            }
        }, 100);
    }

    public stop(transition: number = 0) {
        if (transition === 0) {
            this.gain.gain.value = 0;
        } else {
            this.gain.gain.setValueCurveAtTime([this.globalAudio.volume, 0], this.audioContext.currentTime, transition);
        }

        setTimeout(() => {
            this.pausedAt = 0;
            this.source.stop();
            clearInterval(this.interval);

            this.emit("stop");
        }, transition * 1000);
    }

    public pause() {
        this.pausedAt = this.source.context.currentTime;
        this.audioContext.suspend();
        clearInterval(this.interval);

        this.emit("pause");
    }

    public destroy() {
        this.source.disconnect();
        this.gain.disconnect();
        this.audioContext.close();
        clearInterval(this.interval);
    }

    public on(event: SongEvents, callback: EventCallback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }

        this.events.get(event)?.push(callback);
    }

    public remove(event: SongEvents, callback: EventCallback) {
        const callbacks = this.events.get(event);

        if (!callbacks) {
            return;
        }

        const index = callbacks.indexOf(callback);

        if (index === -1) {
            return;
        }

        callbacks.splice(index, 1);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private emit(event: SongEvents, ...args: any[]) {
        this.events.get(event)?.forEach(callback => callback(args));
    }

    private static isUrl(path: string): boolean {
        let url: URL;

        try {
            url = new URL(path);
        } catch (_) {
            return false;
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }
}