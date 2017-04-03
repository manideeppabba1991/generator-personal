package <%= packageName %>.controller;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.inject.Inject;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by rcon857 on 3/15/2017.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK, classes = { AppController.class })
@WebAppConfiguration
public class AppControllerTest {

  private MockMvc mvc;

  @Before
  public void setUp() {
    this.mvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();
  }

  @Inject
  private WebApplicationContext webApplicationContext;

  @Test
  public void testLocationSearchWorks() throws Exception {
    this.mvc.perform(get("/dashboard")
      .accept(MediaType.TEXT_PLAIN))
      .andExpect(status().isOk());
  }

  @Test
  public void testAccountSearchWorks() throws Exception {
    this.mvc.perform(get("/settings")
      .accept(MediaType.TEXT_PLAIN))
      .andExpect(status().isOk());
  }
}
