# gamification-space

## BEFORE adding to a course

Line 170 of the controller.js refers to a Unique Course Identifier. This course identifier must be changed to reflect the identifier for the course you will be adding the tool to. To do this, navigate to "Manage Files" and copy the bolded directory at top (content > enforced > IDENTIFIER).  

> baseURL: "/content/enforced/10011-Joshua-McKinney-Sandbox-CO/gamificationSpace/"

becomes

> baseURL: "/content/enforced/9001-your-course-identifier/gamificationSpace/"

## Adding the tool to a Brightspace Course

1. First, add the contents of this project to the course in a folder named "gamificationSpace"
2. Add a custom widget to the desired course's homepage using the "Manage Homepage" button at the bottom right of a course
3. On the Homepages screen, create a copy of the Course Default homepage.
4. Click into "Widgets" and create a new widget with a meaningful name and description.
5. On the "Content" tab of the Widgets menu, insert the following code. Note that the "UNIQUE COURSE IDENTIFIER" will be specific to the course you are modifying:

~~~
  <div id="gamificationMain"></div>
  <script>// <![CDATA[
  var jamGamifiction = "{OrgUnitPath}";
  // ]]></script>
  <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.runtime.min.js"></script>
  <script src="https://content.byui.edu/file/c71e8c2c-c858-4165-8283-5174d0f88b9d/1/valence.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3-dsv/1.0.3/d3-dsv.js"></script>
  <script src="/content/enforced/UNIQUE COURSE IDENTIFIER/gamificationSpace/settings.js"></script>
  <p></p>
  <script src="/content/enforced/UNIQUE COURSE IDENTIFIER/gamificationSpace/handlebarsTemplate.js"></script>
  <p></p>
  <script src="/content/enforced/UNIQUE COURSE IDENTIFIER/gamificationSpace/controller.js"></script>
  <p></p>
  <script src="/content/enforced/UNIQUE COURSE IDENTIFIER/gamificationSpace/getCSV.js"></script>
  <!--<script src="https://localhost:8000/settings.js"></script>-->
  <p></p>
  <!--<script src="https://localhost:8000/handlebarsTemplate.js"></script>-->
  <p></p>
  <!--<script src="https://localhost:8000/controller.js"></script>-->
  <p></p>
  <!--<script src="https://localhost:8000/getCSV.js"></script>-->
~~~

On your freshly copied Homepage, select an option that allows you to have a full-width top panel (such as "Large Left Panel") and add your newly created widget to it.
