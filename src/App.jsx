import { useState } from "react";

export default function RegisterForm() {
  // 1) stato del form (campi controllati)
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState(""); // stringa vuota = non selezionata
  const [years, setYears] = useState(""); // viene tenuto come stringa per gestire input vuoto
  const [bio, setBio] = useState("");

  // 2) stato per gli errori di validazione al submit
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault(); // evita refresh pagina

    // 3) validazione (costruzione di un oggetto errori)
    const newErrors = {};

    // trim = togliere gli spazi prima/dopo (evita "   " come valore valido)
    if (!fullName.trim()) newErrors.fullName = "Inserisci il nome completo.";
    if (!username.trim()) newErrors.username = "Inserisci uno username.";
    if (!password.trim()) newErrors.password = "Inserisci una password.";
    if (!bio.trim()) newErrors.bio = "Inserisci una breve descrizione.";

    // specializzazione (deve essere selezionata obbligatoriamente)
    if (!specialization)
      newErrors.specialization = "Seleziona una specializzazione.";

    // anni esperienza (deve essere un numero positivo)
    const yearsNumber = Number(years);

    // controlli: non vuoto, deve essere un numero, deve essere > 0
    if (years === "") {
      newErrors.years = "Inserisci gli anni di esperienza.";
    } else if (Number.isNaN(yearsNumber)) {
      newErrors.years = "Gli anni di esperienza devono essere un numero.";
    } else if (yearsNumber <= 0) {
      newErrors.years =
        "Gli anni di esperienza devono essere un numero positivo.";
    }

    // 4) se ci sono errori, si salvano e viene bloccato il submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 5) se è valido, eventuali vecchi errori vanno puliti
    setErrors({});

    // 6) creazione di un oggetto con i dati del form
    const formData = {
      fullName: fullName.trim(),
      username: username.trim(),
      password: password,
      specialization,
      years: yearsNumber,
      bio: bio.trim(),
    };

    // 7) milestone 1: stampa in console
    console.log("Form valido, dati inviati:", formData);

    // reset form dopo submit valido
    setFullName("");
    setUsername("");
    setPassword("");
    setSpecialization("");
    setYears("");
    setBio("");
  }

  return (
    <section>
      <h2>Registrazione Developer</h2>

      <form onSubmit={handleSubmit}>
        {/* NOME COMPLETO */}
        <div>
          <label htmlFor="fullName">Nome completo</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Es. Bianca Rossi"
          />
          {errors.fullName && <p style={{ color: "red" }}>{errors.fullName}</p>}
        </div>

        {/* USERNAME */}
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Es. biancaDev"
          />
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
        </div>

        {/* PASSWORD */}
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        {/* SPECIALIZZAZIONE */}
        <div>
          <label htmlFor="specialization">Specializzazione</label>
          <select
            id="specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="">-- Seleziona --</option>
            <option value="Full Stack">Full Stack</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
          </select>
          {errors.specialization && (
            <p style={{ color: "red" }}>{errors.specialization}</p>
          )}
        </div>

        {/* ANNI DI ESPERIENZA */}
        <div>
          <label htmlFor="years">Anni di esperienza</label>
          <input
            id="years"
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="Es. 2"
            min="0"
          />
          {errors.years && <p style={{ color: "red" }}>{errors.years}</p>}
        </div>

        {/* BIO / DESCRIZIONE */}
        <div>
          <label htmlFor="bio">Breve descrizione</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Racconta qualcosa su di te..."
            rows={5}
          />
          {errors.bio && <p style={{ color: "red" }}>{errors.bio}</p>}
        </div>

        <button type="submit">Registrati</button>
      </form>
    </section>
  );
}
