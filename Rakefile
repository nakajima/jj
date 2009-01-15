require File.join(File.dirname(__FILE__), *%w[lib helpers])

desc "Build the jj.js file"
task :dist do
  content = %w(jj.base jj.method_proxy jj.stub jj.mock).inject('') do |js, name|
    js << read_js(name)
  end
  
  write_dist read_template.erb_eval(binding)
end