document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bmiForm");
  const result = document.getElementById("bmiResult");
  if (!form || !result) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const height = Number(document.getElementById("height").value) / 100;
    const weight = Number(document.getElementById("weight").value);

    if (!height || !weight || height <= 0 || weight <= 0) {
      result.textContent = "Enter valid height and weight.";
      return;
    }

    const bmi = weight / (height * height);
    let category = "Normal";
    if (bmi < 18.5) category = "Underweight";
    if (bmi >= 25) category = "Overweight";
    if (bmi >= 30) category = "Obese";

    result.textContent = `Your BMI is ${bmi.toFixed(1)} (${category}). Ask our trainers for a focused plan.`;
  });
});
