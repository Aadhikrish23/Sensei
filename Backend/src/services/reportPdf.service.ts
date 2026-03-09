import puppeteer from "puppeteer";

export const generateInterviewReportPDF = async (
  report: any,
  summary: any,
  transcripts: any[],
  sessionId: string
) => {

  const html = `
  <html>
  <head>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <style>

  body{
    font-family: Arial;
    padding:40px;
  }

  h1{
    color:#2c3e50;
  }

  h2{
    margin-top:25px;
  }

  .section{
    margin-bottom:20px;
  }

  .card{
    padding:15px;
    border:1px solid #ddd;
    border-radius:8px;
    margin-bottom:15px;
  }

  .timeline{
    border-left:3px solid #2c3e50;
    padding-left:15px;
  }

  .timeline-item{
    margin-bottom:20px;
  }

  </style>

  </head>

  <body>

  <h1>Sensei Interview Evaluation</h1>

  <div class="section">

  <h2>Candidate Score</h2>

  <div class="card">
  Overall Score: ${summary.overallScore}
  </div>

  </div>

  <div class="section">

  <h2>Skill Breakdown</h2>

  <ul>
  <li>Technical: ${summary.technicalAvg}</li>
  <li>Depth: ${summary.depthAvg}</li>
  <li>Communication: ${summary.communicationAvg}</li>
  <li>Relevance: ${summary.relevanceAvg}</li>
  </ul>

  </div>

  <div class="section">

  <h2>Skill Radar Chart</h2>

  <canvas id="radarChart"></canvas>

  </div>

  <div class="section">

  <h2>Strengths</h2>

  <ul>
  ${report.strengths.map((s: string)=>`<li>${s}</li>`).join("")}
  </ul>

  </div>

  <div class="section">

  <h2>Weaknesses</h2>

  <ul>
  ${report.weaknesses.map((w: string)=>`<li>${w}</li>`).join("")}
  </ul>

  </div>

  <div class="section">

  <h2>Technical Depth Feedback</h2>

  <p>${report.technical_depth_feedback}</p>

  </div>

  <div class="section">

  <h2>Communication Feedback</h2>

  <p>${report.communication_feedback}</p>

  </div>

  <div class="section">

  <h2>Improvement Plan</h2>

  <ul>
  ${report.improvement_plan.map((i: string)=>`<li>${i}</li>`).join("")}
  </ul>

  </div>

  <div style="page-break-after:always;"></div>

  <h1>Interview Transcript</h1>

  <div class="timeline">

  ${transcripts.map((t,index)=>`

  <div class="timeline-item">

  <h3>Question ${index+1}</h3>
  <p>${t.question}</p>

  <h4>Candidate Answer</h4>
  <p>${t.answer}</p>

  <h4>Missing Points</h4>

  <ul>
  ${t.missing.map((m:string)=>`<li>${m}</li>`).join("")}
  </ul>

  </div>

  `).join("")}

  </div>

  <script>

  const ctx = document.getElementById('radarChart');

  new Chart(ctx, {
      type: 'radar',
      data: {
          labels: ['Technical','Depth','Communication','Relevance'],
          datasets: [{
              label: 'Candidate Skill',
              data: [
                ${summary.technicalAvg},
                ${summary.depthAvg},
                ${summary.communicationAvg},
                ${summary.relevanceAvg}
              ],
              fill: true
          }]
      }
  });

  </script>

  </body>
  </html>
  `;

  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.setContent(html,{waitUntil:"networkidle0"});

  const pdf = await page.pdf({
    format:"A4",
    printBackground:true
  });

  await browser.close();

  return pdf;
};