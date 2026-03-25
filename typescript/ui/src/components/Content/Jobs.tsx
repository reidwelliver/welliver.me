export function Jobs() {
  return (
    <article className="content">
      <h2>Career History</h2>
      <h3>2014-2015 - SevOne - Junior Developer</h3>
      <p>
        I worked as a junior developer at SevOne starting with a Drexel
        University Co-op and continuing as an hourly employee while finishing
        college. SevOne is an enterprise network management appliance company
        serving many Fortune 500 companies.
      </p>
      <p>
        I was embedded in a full-stack dev deam working on ExtJS frontends, PHP
        middleware, C++ backends, and MySQL databases. I learned a lot about
        working with large codebases, traversing the stack, and collaborating
        with a team on large features from conception to deployment.
      </p>
      <h3>2015-2016 - Blue Track Media - Software Engineer</h3>
      <p>
        I worked as a software engineer at BlueTrackMedia while graduating
        college. BlueTrackMedia has a small software shop maintaining a very
        large ad network.
      </p>
      <p>
        While at BlueTrackMedia I worked to convert their large legacy PHP
        codebase into scalable cloud microservices, using Docker and AWS. This
        was also my first experience with early class-based React building
        greenfield sales dashboards.
      </p>
      <h3>2016-2019 - Enterra Solutions - Frontend Developer</h3>
      <p>
        After college, I joined Enterra Solutions, a software company developing
        supply chain modeling and optimization software around early AI.
      </p>
      <p>
        I worked with a multidisciplinary team of data scientists, early AI
        researchers, and software engineers. My work was primarily focused
        around a React frontend and associated NodeJS middleware for visualizing
        and interacting with supply chain plans made from feeding large amounts
        of sales data from clients into a proprietary AI algorithm.
      </p>
      <p>
        We developed React/D3 dashboard visualizations with client side filters
        running in webworkers and reporting rollups to IndexedDB. Real time
        supply data was sent via a RabbitMQ broker as projections were
        processed. I became responsible for the dev stack and deployments, going
        deep with Docker, CI/CD, and Azure including serverless deployments.
        During this time I transitioned to working from home, eventually moving
        to Utah and working remotely full time.
      </p>
      <h3>2019-2022 - Distru - Senior Frontend Engineer</h3>
      <p>
        In 2019 I was offered an opportunity to join Distru, a company
        developing ERP and compliance software for the cannabis industry. Their
        remote-first team culture was an excellent change of pace.
      </p>
      <p>
        I was first responsible for migrating a large legacy frontend codebase
        from giant class-based components to modern React with hooks, context,
        and functional components. I introduced flow-based testing for their
        complex form logic, and was responsible for several large features and
        updates to make their core workflows more power-user friendly. Later in
        my time at Distru, I was tasked with creating a React Native mobile app
        from scratch to be used by warehouse employees. It featured many
        camera-heavy views for barcode scanning, and embedded their web
        application with state syncronization to fill in workflow gaps while the
        app continued adding features.
      </p>
      <h3>
        2022-Present - Lab2Fab | Middleby Automation - Software Engineering Lead
      </h3>
      <p>
        In 2022, I was invited to join Lab2Fab, a subsidiary of commercial
        kitchen equipment manufacturer Middleby. Lab2Fab produces cutting edge
        collaborative kitchen robotics systems featuring robotic arms running
        deep fryers and making pizzas in commerical kitchens.
      </p>
      <p>
        Initially, my work at Lab2Fab was focused on building a React Native UI
        to be deployed to large form factor tablets to control the robot systems
        in kitchens. This also entailed building middleware for state
        synchronization between the UI and various pieces of hardware. After
        getting the UI and middleware off the ground, I implemented AWS IoT
        Greengrass for OTA updates and remote access in the field. More
        recently, I have switched to developing a Rust hardware orchestrator, a
        Rust hardware adapter for heterogenous protocols including Modbus and
        TCP/Serial, and converting the communication layer of the orchestration
        system, hardware, and UI to MQTT. During my time at Lab2Fab, as the
        company has grown, I have been promoted to be involved in team
        leadership and trusted to make large architectural decisions.
      </p>
    </article>
  );
}
