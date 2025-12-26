import { useState, useRef } from "react";

export default function RegisterForm() {
  // 1) campi controllati (necessari per validazione live)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  // 2) campi non controllati
  const fullNameRef = useRef(null);
  const specializationRef = useRef(null);
  const yearsRef = useRef(null);

  // 3) stato per errori di validazione al submit
  const [errors, setErrors] = useState({});

  // 4) stato per la validazione in tempo reale
  const [liveValidation, setLiveValidation] = useState({
    username: null,
    password: null,
    bio: null,
  });

  // caratteri validi per la validazione
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/`~";

  // validazione username (solo alfanumerico, min 6 caratteri)
  function validateUsername(value) {
    if (value.length < 6) return false;

    for (let char of value.toLowerCase()) {
      if (!letters.includes(char) && !numbers.includes(char)) {
        return false;
      }
    }
    return true;
  }

  // validazione password (min 8, 1 lettera, 1 numero, 1 simbolo)
  function validatePassword(value) {
    if (value.length < 8) return false;

    let hasLetter = false;
    let hasNumber = false;
    let hasSymbol = false;

    for (let char of value.toLowerCase()) {
      if (letters.includes(char)) hasLetter = true;
      else if (numbers.includes(char)) hasNumber = true;
      else if (symbols.includes(char)) hasSymbol = true;
    }

    return hasLetter && hasNumber && hasSymbol;
  }

  // validazione bio (100–1000 caratteri, senza spazi iniziali/finali)
  function validateBio(value) {
    const trimmed = value.trim();
    return trimmed.length >= 100 && trimmed.length <= 1000;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    // lettura valori dai campi non controllati
    const fullName = fullNameRef.current.value;
    const specialization = specializationRef.current.value;
    const yearsValue = yearsRef.current.value;
    const yearsNumber = Number(yearsValue);

    // validazione campi non controllati
    if (!fullName.trim()) newErrors.fullName = "Inserisci il nome completo.";

    if (!specialization)
      newErrors.specialization = "Seleziona una specializzazione.";

    if (yearsValue === "") {
      newErrors.years = "Inserisci gli anni di esperienza.";
    } else if (Number.isNaN(yearsNumber)) {
      newErrors.years = "Gli anni di esperienza devono essere un numero.";
    } else if (yearsNumber <= 0) {
      newErrors.years =
        "Gli anni di esperienza devono essere un numero positivo.";
    }

    // validazione campi controllati
    if (!username.trim()) newErrors.username = "Inserisci uno username.";

    if (!password.trim()) newErrors.password = "Inserisci una password.";

    if (!bio.trim()) newErrors.bio = "Inserisci una breve descrizione.";

    // blocco submit se validazione in tempo reale fallisce
    if (liveValidation.username === false)
      newErrors.username = "Username non valido.";

    if (liveValidation.password === false)
      newErrors.password = "Password non valida.";

    if (liveValidation.bio === false) newErrors.bio = "Descrizione non valida.";

    // se ci sono errori, viene bloccato il submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // pulizia errori precedenti
    setErrors({});

    // creazione oggetto finale dati form
    const formData = {
      fullName: fullName.trim(),
      username: username.trim(),
      password,
      specialization,
      years: yearsNumber,
      bio: bio.trim(),
    };

    console.log("Form valido, dati inviati:", formData);

    // reset campi controllati
    setUsername("");
    setPassword("");
    setBio("");
    setLiveValidation({
      username: null,
      password: null,
      bio: null,
    });

    // reset campi non controllati
    fullNameRef.current.value = "";
    specializationRef.current.value = "";
    yearsRef.current.value = "";
  }

  return (
    <section>
      <h2>Registrazione Developer</h2>

      <form onSubmit={handleSubmit}>
        {/* NOME COMPLETO */}
        <div>
          <label htmlFor="fullName">Nome completo</label>
          <input id="fullName" type="text" ref={fullNameRef} />
          {errors.fullName && <p style={{ color: "red" }}>{errors.fullName}</p>}
        </div>

        {/* USERNAME */}
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              const value = e.target.value;
              setUsername(value);
              setLiveValidation({
                ...liveValidation,
                username: validateUsername(value),
              });
            }}
          />
          {liveValidation.username === false && (
            <p style={{ color: "red" }}>
              Almeno 6 caratteri, solo lettere e numeri.
            </p>
          )}
          {liveValidation.username === true && (
            <p style={{ color: "green" }}>Username valido.</p>
          )}
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
        </div>

        {/* PASSWORD */}
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              setLiveValidation({
                ...liveValidation,
                password: validatePassword(value),
              });
            }}
          />
          {liveValidation.password === false && (
            <p style={{ color: "red" }}>
              Minimo 8 caratteri, 1 lettera, 1 numero, 1 simbolo.
            </p>
          )}
          {liveValidation.password === true && (
            <p style={{ color: "green" }}>Password valida.</p>
          )}
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        {/* SPECIALIZZAZIONE */}
        <div>
          <label htmlFor="specialization">Specializzazione</label>
          <select id="specialization" ref={specializationRef}>
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
          <input id="years" type="number" ref={yearsRef} min="0" />
          {errors.years && <p style={{ color: "red" }}>{errors.years}</p>}
        </div>

        {/* BIO / DESCRIZIONE */}
        <div>
          <label htmlFor="bio">Breve descrizione</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => {
              const value = e.target.value;
              setBio(value);
              setLiveValidation({
                ...liveValidation,
                bio: validateBio(value),
              });
            }}
            rows={5}
          />
          {liveValidation.bio === false && (
            <p style={{ color: "red" }}>
              Tra 100 e 1000 caratteri (senza spazi iniziali/finali).
            </p>
          )}
          {liveValidation.bio === true && (
            <p style={{ color: "green" }}>Descrizione valida.</p>
          )}
          {errors.bio && <p style={{ color: "red" }}>{errors.bio}</p>}
        </div>

        <button type="submit">Registrati</button>
      </form>
    </section>
  );
}
