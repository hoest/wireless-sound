import fetch from 'isomorphic-fetch';

export const sendMail = (form) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(form),
  };

  return fetch('/mail.php', config)
    .then(response => response.json())
    .catch(error => error);
}
