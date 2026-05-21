"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Loader2,
  Save,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Team } from "@/lib/teams";
import { ProfileAvatar } from "@/components/profile/profile-avatar";

interface InitialProfile {
  pseudo: string;
  bio: string | null;
  favorite_team: string | null;
  avatar_url: string | null;
  equipped_frame?: string | null;
}

interface Props {
  profile: InitialProfile;
  teams: Team[];
}

const BIO_MAX = 200;

export function ProfileForm({ profile, teams }: Props) {
  const router = useRouter();
  const [pseudo, setPseudo] = useState(profile.pseudo);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [favoriteTeam, setFavoriteTeam] = useState<string | null>(
    profile.favorite_team,
  );
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url);

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload échoué");
      setAvatarUrl(data.avatar_url as string);
      setSavedAt(Date.now());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'upload");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarRemove = async () => {
    setUploadingAvatar(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Suppression échouée");
      setAvatarUrl(null);
      setSavedAt(Date.now());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pseudo: pseudo.trim(),
          bio: bio.trim() === "" ? null : bio.trim(),
          favorite_team: favoriteTeam,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de la sauvegarde");
      setSavedAt(Date.now());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const justSaved = savedAt && Date.now() - savedAt < 2500;

  return (
    <div className="space-y-6">
      {/* Carte avatar + pseudo */}
      <div className="rounded-2xl border border-border bg-bg-card/40 p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar (avec cadre équipé) */}
          <div className="relative">
            <div className="relative">
              <ProfileAvatar
                avatarUrl={avatarUrl}
                pseudo={pseudo}
                frameId={profile.equipped_frame}
                size={112}
              />
              {uploadingAvatar && (
                <div className="absolute inset-0 rounded-full bg-bg/80 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-text" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-accent-red text-white flex items-center justify-center hover:bg-accent-red-hover transition-colors shadow-lg disabled:opacity-50"
              aria-label="Changer ma photo"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleAvatarUpload(f);
                e.target.value = "";
              }}
            />
          </div>

          {/* Pseudo + bio */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">
                Pseudo
              </label>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                minLength={2}
                maxLength={20}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
              <p className="mt-1 text-xs text-text-muted">
                Entre 2 et 20 caractères. Visible dans le classement.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
                rows={3}
                placeholder="Une phrase qui te décrit en tant que fan de foot…"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
              />
              <p className="mt-1 text-xs text-text-muted flex justify-between">
                <span>{bio.length} / {BIO_MAX}</span>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleAvatarRemove}
                    className="inline-flex items-center gap-1 text-text-muted hover:text-error"
                  >
                    <Trash2 className="h-3 w-3" /> Supprimer la photo
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Équipe favorite */}
      <div className="rounded-2xl border border-border bg-bg-card/40 p-6">
        <h2 className="font-bold mb-1">Mon équipe favorite</h2>
        <p className="text-xs text-text-muted mb-4">
          Tu pourras débloquer des thèmes aux couleurs de ton équipe (à venir).
        </p>

        {/* Sélection actuelle */}
        {favoriteTeam ? (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-accent-blue/30 bg-accent-blue/5 px-3 py-2">
            <span className="text-2xl">
              {teams.find((t) => t.code === favoriteTeam)?.flag ?? "🏳️"}
            </span>
            <div className="flex-1">
              <div className="text-sm font-semibold">
                {teams.find((t) => t.code === favoriteTeam)?.name ?? favoriteTeam}
              </div>
              <div className="text-xs text-text-muted">
                {teams.find((t) => t.code === favoriteTeam)?.confederation}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFavoriteTeam(null)}
              className="text-xs text-text-muted hover:text-error"
            >
              Retirer
            </button>
          </div>
        ) : (
          <p className="mb-4 text-xs italic text-text-muted">
            Aucune équipe sélectionnée
          </p>
        )}

        {/* Grille équipes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-80 overflow-y-auto pr-1">
          {teams.map((team) => {
            const selected = favoriteTeam === team.code;
            return (
              <button
                key={team.code}
                type="button"
                onClick={() =>
                  setFavoriteTeam(selected ? null : team.code)
                }
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all",
                  selected
                    ? "border-accent-red bg-accent-red/10 ring-1 ring-accent-red"
                    : "border-border bg-bg hover:bg-bg-card-hover hover:border-accent-blue/50",
                )}
              >
                <span className="text-xl shrink-0">{team.flag}</span>
                <span className="text-xs font-medium truncate">
                  {team.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 text-sm">
          {error && (
            <p className="flex items-center gap-1.5 text-error">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}
          {justSaved && !error && (
            <p className="flex items-center gap-1.5 text-success">
              <CheckCircle2 className="h-4 w-4" /> Profil mis à jour
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || uploadingAvatar}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-red-hover transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Enregistrer
        </button>
      </div>
    </div>
  );
}
