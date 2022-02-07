(async () => {
  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const today = new Date();

  const fetchData = async () => {
    const [isoDate] = today.toISOString().split("T");
    const url = `https://api.vogue.com/production/photos?count=1&date_from=${isoDate}&date_to=${isoDate}&feature=true&locale=en-us&type_ids=3`;

    const res = await fetch(url);
    const data = await res.json();

    console.log(data);

    return data.items[0];
  };

  const render = ({ title, photographer, gallery_image }) => {
    document.getElementById("day").textContent = formatDate(today);
    document.getElementById("title").textContent = title;
    const photograherName = document.getElementById("photographerName");
    photograherName.textContent = photographer.name;
    photograherName.href = `https://www.vogue.com/photovogue/photographers/${photographer.id}`;
    document.getElementById("photographerBiography").textContent =
      photographer.biography;
    document.getElementById("main-image").src = gallery_image;
  };

  console.log("fetching data…");

  const data = await fetchData();

  console.log("result:", data);

  render(data);
})();
