<script lang="ts">
  const projects = [
    { title: 'Svelte CLI Tool', desc: 'A custom terminal toolkit.', link: '#' },
    { title: 'E-commerce API', desc: 'High-throughput payment gateway.', link: '#' }
  ];
</script>

<div class="page">
  <h2>projects/</h2>
  <div class="grid">
    {#each projects as project}
      <div class="card">
        <h3>{project.title}</h3>
        <p>{project.desc}</p>
        <a href={project.link} target="_blank">View Repo →</a>
      </div>
    {/each}
  </div>
</div>

<style>
  .page { margin: 15px 0; }
  h2 { color: #27c93f; }
  .grid { display: flex; gap: 15px; flex-wrap: wrap; }
  .card {
    background: #21262d;
    padding: 15px;
    border-radius: 6px;
    border: 1px solid #30363d;
  }
  a { color: #58a6ff; text-decoration: none; }
</style>
