package <%= packageName %>;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@SpringBootApplication(scanBasePackages = {"<%= packageName %>"})
public class App<%= mainPackageName %>Application {
  public static void main(String[] args) {
    SpringApplication.run(App<%= mainPackageName %>Application.class, args);
  }
}
